import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { get, remove, runTransaction, serverTimestamp, update } from 'firebase/database'
import { hostDb } from '../lib/firebase.js'
import { loadQuiz, acceptedAnswers } from '../lib/quizStore.js'
import { generateRoomCode, groupPlayers, hashKit, roomPath, roomRef, useRoom } from '../lib/room.js'
import { isAnswerMatch, pointsAt } from '../lib/scoring.js'

/** Creates a room with a fresh, unused 6-digit code and returns the code. */
export async function createRoom(uid, quiz, maxTeam) {
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

function publicQuestion(mode, q, hintsRevealed) {
  return mode === 'clues' ? { category: q.category, hints: q.hints.slice(0, hintsRevealed) } : { prompt: q.prompt, options: q.options }
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
      const key = `${state.qIndex}:${teamId}`
      if (results[teamId] || scoredRef.current.has(key) || typeof a.at !== 'number') return
      scoredRef.current.add(key)
      const late = a.at > endsAt
      const correct = !late && (meta.mode === 'clues' ? isAnswerMatch(a.value, acceptedAnswers(q)) : Number(a.value) === q.correct)
      patch[`results/${state.qIndex}/${teamId}`] = { correct, late, points: correct ? pointsAt(endsAt - a.at, totalMs) : 0 }
    })
    if (Object.keys(patch).length) write(patch)
  }, [room, quiz, state, meta, write])

  // Players who arrive mid-game get their own team so they can still play.
  useEffect(() => {
    if (!room || !state || state.phase === 'lobby') return
    const teams = room.teams || {}
    const patch = {}
    groupPlayers(room.players).forEach(({ teamId, members }) => {
      if (teams[teamId]) return
      patch[`teams/${teamId}`] = {
        members: Object.fromEntries(members.map((m) => [m.uid, m.name])),
        kit: hashKit(teamId),
        score: 0,
        lastGain: 0,
      }
    })
    if (Object.keys(patch).length) write(patch)
  }, [room, state, write])

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
        return write({
          teams,
          answers: null,
          results: null,
          reveal: null,
          question: publicQuestion(meta.mode, quiz.questions[0], 1),
          state: { phase: 'question', qIndex: 0, startedAt: serverTimestamp(), hintsRevealed: 1 },
        })
      },
      revealHint: () => {
        const n = Math.min(4, (state.hintsRevealed || 1) + 1)
        return write({ 'state/hintsRevealed': n, question: publicQuestion(meta.mode, question, n) })
      },
      showAnswer: () => {
        const results = room.results?.[state.qIndex] || {}
        const answers = room.answers?.[state.qIndex] || {}
        const patch = {
          'state/phase': 'reveal',
          'state/hintsRevealed': 4,
          question: publicQuestion(meta.mode, question, 4),
          reveal: meta.mode === 'clues' ? { text: question.answer } : { index: question.correct },
        }
        Object.entries(room.teams || {}).forEach(([teamId, t]) => {
          const r = results[teamId]
          const gain = r?.correct ? r.points : 0
          patch[`teams/${teamId}/score`] = (t.score || 0) + gain
          patch[`teams/${teamId}/lastGain`] = gain
          patch[`teams/${teamId}/lastCorrect`] = r ? r.correct : null
          patch[`teams/${teamId}/lastValue`] = answers[teamId]?.value ?? null
        })
        return write(patch)
      },
      next: () => {
        const nextIndex = state.qIndex + 1
        if (nextIndex >= quiz.questions.length) return write({ 'state/phase': 'final' })
        return write({
          reveal: null,
          question: publicQuestion(meta.mode, quiz.questions[nextIndex], 1),
          state: { phase: 'question', qIndex: nextIndex, startedAt: serverTimestamp(), hintsRevealed: 1 },
        })
      },
      restart: () =>
        write({
          teams: null,
          answers: null,
          results: null,
          reveal: null,
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
