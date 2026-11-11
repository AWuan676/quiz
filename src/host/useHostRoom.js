import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { get, remove, runTransaction, serverTimestamp, update } from 'firebase/database'
import { hostDb } from '../lib/firebase.js'
import { loadQuiz, acceptedAnswers } from '../lib/quizStore.js'
import { dealHints, generateRoomCode, groupPlayers, hashKit, orderedMembers, roomPath, roomRef, useRoom } from '../lib/room.js'
import { isAnswerMatch, pointsAt } from '../lib/scoring.js'

/** Creates a room with a fresh, unused 6-digit code and returns the code. */
export async function createRoom(uid, quiz, maxTeam, multiTry = false) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateRoomCode()
    const meta = {
      hostUid: uid,
      quizId: quiz.id,
      title: quiz.title,
      mode: quiz.mode,
      duration: quiz.duration,
      total: quiz.questions.length,
      maxTeam,
      // false: one answer per team per question. true: keep trying until right or time runs out.
      multiTry: Boolean(multiTry),
      createdAt: Date.now(),
    }
    const tx = await runTransaction(roomRef(hostDb, code, 'meta'), (current) => (current ? undefined : meta))
    if (tx.committed) {
      await update(roomRef(hostDb, code), { state: { phase: 'lobby', qIndex: 0, startedAt: 0, hintsRevealed: 1 } })
      return code
    }
  }
  throw new Error('no-free-code')
}

/** What the projector and phones may show. Clues stay on members' phones until the reveal. */
function publicQuestion(mode, q, revealed = false) {
  if (mode !== 'clues') return { prompt: q.prompt, options: q.options }
  return revealed ? { category: q.category, hints: q.hints } : { category: q.category }
}

/** Deal question q's hints to every member of the given teams: { 'hints/<uid>': {...} }. */
function hintsPatch(teams, players, q, qIndex) {
  const patch = {}
  Object.values(teams).forEach((team) => {
    const dealt = dealHints(q.hints, orderedMembers(team, players), qIndex)
    Object.entries(dealt).forEach(([uid, h]) => (patch[`hints/${uid}`] = h))
  })
  return patch
}

/**
 * The host is the referee: it alone reads the quiz with its answers (from Firestore),
 * scores each team's first answer against the server clock, and publishes results.
 */
export function useHostRoom(code) {
  const { room, missing } = useRoom(hostDb, code)
  const [quiz, setQuiz] = useState(null)
  const quizId = room?.meta?.quizId
  const scoredRef = useRef(new Set())

  useEffect(() => {
    if (!quizId) return
    loadQuiz(quizId).then(setQuiz)
  }, [quizId])

  const meta = room?.meta
  const state = room?.state
  const question = quiz?.questions?.[state?.qIndex ?? 0]
  const write = useCallback((patch) => update(roomRef(hostDb, code), patch), [code])

  // Score new answers as they land.
  useEffect(() => {
    if (!room || !quiz || state?.phase !== 'question') return
    const q = quiz.questions[state.qIndex]
    const answers = room.answers?.[state.qIndex] || {}
    const results = room.results?.[state.qIndex] || {}
    const totalMs = meta.duration * 1000
    const endsAt = state.startedAt + totalMs
    const patch = {}
    Object.entries(answers).forEach(([teamId, a]) => {
      const prev = results[teamId]
      const key = `${state.qIndex}:${teamId}:${a.at}`
      if ((prev && !prev.retry) || scoredRef.current.has(key) || typeof a.at !== 'number') return
      scoredRef.current.add(key)
      const late = a.at > endsAt
      const correct = !late && (meta.mode === 'clues' ? isAnswerMatch(a.value, acceptedAnswers(q)) : Number(a.value) === q.correct)
      const wrong = prev?.wrong || []
      if (!correct && !late && meta.multiTry) {
        // Multi-try: record the miss and clear the answer so the team can try again.
        patch[`results/${state.qIndex}/${teamId}`] = { correct: false, retry: true, points: 0, wrong: [...wrong, a.value] }
        patch[`answers/${state.qIndex}/${teamId}`] = null
      } else {
        patch[`results/${state.qIndex}/${teamId}`] = { correct, late, points: correct ? pointsAt(endsAt - a.at, totalMs) : 0, wrong }
      }
    })
    if (Object.keys(patch).length) write(patch)
  }, [room, quiz, state, meta, write])

  // Players who arrive mid-game get their own team so they can still play.
  useEffect(() => {
    if (!room || !state || state.phase === 'lobby') return
    const teams = room.teams || {}
    let patch = {}
    groupPlayers(room.players).forEach(({ teamId, members }) => {
      if (teams[teamId]) return
      const team = {
        members: Object.fromEntries(members.map((m) => [m.uid, m.name])),
        kit: hashKit(teamId),
        score: 0,
        lastGain: 0,
      }
      patch[`teams/${teamId}`] = team
      // A late team still needs its clues for the question in play.
      if (meta?.mode === 'clues' && state.phase === 'question' && quiz) {
        patch = { ...patch, ...hintsPatch({ [teamId]: team }, room.players, quiz.questions[state.qIndex], state.qIndex) }
      }
    })
    if (Object.keys(patch).length) write(patch)
  }, [room, state, meta, quiz, write])

  const actions = useMemo(
    () => ({
      start: () => {
        const teams = {}
        groupPlayers(room.players).forEach(({ teamId, members }, i) => {
          teams[teamId] = {
            members: Object.fromEntries(members.map((m) => [m.uid, m.name])),
            kit: i % 8,
            score: 0,
            lastGain: 0,
          }
        })
        scoredRef.current = new Set()
        const q0 = quiz.questions[0]
        return write({
          teams,
          answers: null,
          results: null,
          reveal: null,
          hints: null, // cleared here, dealt in a second write: one update cannot null a parent and set its children
          question: publicQuestion(meta.mode, q0),
          state: { phase: 'question', qIndex: 0, startedAt: serverTimestamp(), hintsRevealed: 0 },
        }).then(() => (meta.mode === 'clues' ? write(hintsPatch(teams, room.players, q0, 0)) : undefined))
      },
      showAnswer: () => {
        const results = room.results?.[state.qIndex] || {}
        const answers = room.answers?.[state.qIndex] || {}
        const patch = {
          'state/phase': 'reveal',
          'state/hintsRevealed': 4,
          question: publicQuestion(meta.mode, question, true),
          reveal: meta.mode === 'clues' ? { text: question.answer } : { index: question.correct },
        }
        Object.entries(room.teams || {}).forEach(([teamId, t]) => {
          const r = results[teamId]
          const gain = r?.correct ? r.points : 0
          patch[`teams/${teamId}/score`] = (t.score || 0) + gain
          patch[`teams/${teamId}/lastGain`] = gain
          patch[`teams/${teamId}/lastCorrect`] = r ? r.correct : null
          patch[`teams/${teamId}/lastValue`] = answers[teamId]?.value ?? r?.wrong?.[r.wrong.length - 1] ?? null
        })
        return write(patch)
      },
      next: () => {
        const nextIndex = state.qIndex + 1
        if (nextIndex >= quiz.questions.length) return write({ 'state/phase': 'final' })
        const nq = quiz.questions[nextIndex]
        return write({
          reveal: null,
          question: publicQuestion(meta.mode, nq),
          // Deal the new clues in the same write as the phase change, so nobody sees an empty phone.
          ...(meta.mode === 'clues' ? hintsPatch(room.teams || {}, room.players, nq, nextIndex) : {}),
          state: { phase: 'question', qIndex: nextIndex, startedAt: serverTimestamp(), hintsRevealed: 0 },
        })
      },
      // Skip the remaining questions and go straight to the leaderboard.
      endEarly: () => write({ 'state/phase': 'final' }),
      restart: () =>
        write({
          teams: null,
          answers: null,
          results: null,
          reveal: null,
          hints: null,
          question: null,
          state: { phase: 'lobby', qIndex: 0, startedAt: 0, hintsRevealed: 1 },
        }),
      kick: (uid) => remove(roomRef(hostDb, code, `players/${uid}`)),
      close: async () => {
        await write({ 'state/phase': 'closed' })
        await remove(roomRef(hostDb, code))
      },
    }),
    [room, state, meta, quiz, question, write, code],
  )

  return { code, room, missing, quiz, meta, state, question, actions }
}

/** True when this signed-in host owns the room (used to resume after a refresh). */
export async function ownsRoom(code, uid) {
  const snap = await get(roomRef(hostDb, code, 'meta/hostUid'))
  return snap.val() === uid
}

export { roomPath }
