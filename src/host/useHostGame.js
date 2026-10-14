import { useCallback, useEffect, useReducer, useRef } from 'react'
import { EVENTS, useMultiplayerSync } from '../hooks/useMultiplayerSync.js'
import { MODES } from '../data/quizzes.js'
import { generateRoomCode, isAnswerMatch, normalizeAnswer, pointsAt } from '../lib/scoring.js'
import { kitFor, MAX_TEAMS } from '../lib/kits.js'

const STORAGE_KEY = 'mq-host-state'

const initialState = {
  phase: 'setup', // setup | lobby | question | reveal | final
  mode: 'clues', // clues | standard
  duration: 30,
  roomCode: null,
  teams: [],
  qIndex: 0,
  startedAt: 0,
  hintsRevealed: 1,
  answers: {}, // teamId -> { value, correct, points, at } for the current question
}

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    return saved?.phase ? { ...initialState, ...saved } : initialState
  } catch {
    return initialState
  }
}

const resetTeamRound = (t) => ({ ...t, lastGain: 0, lastCorrect: null, lastValue: null })

function reducer(s, a) {
  switch (a.type) {
    case 'SET_MODE':
      return { ...s, mode: a.mode }
    case 'SET_DURATION':
      return { ...s, duration: a.duration }
    case 'OPEN_ROOM':
      return {
        ...s,
        phase: 'lobby',
        roomCode: s.roomCode || generateRoomCode(),
        qIndex: 0,
        answers: {},
        teams: s.teams.map((t) => ({ ...resetTeamRound(t), score: 0 })),
      }
    case 'BACK_TO_SETUP':
      return { ...s, phase: 'setup' }
    case 'ADD_TEAM': {
      const clash = s.teams.some((t) => t.id === a.team.id || normalizeAnswer(t.name) === normalizeAnswer(a.team.name))
      return clash ? s : { ...s, teams: [...s.teams, a.team] }
    }
    case 'REMOVE_TEAM':
      return { ...s, teams: s.teams.filter((t) => t.id !== a.id) }
    case 'START_QUESTION':
      return {
        ...s,
        phase: 'question',
        qIndex: a.qIndex,
        startedAt: a.at,
        hintsRevealed: 1,
        answers: {},
        teams: s.teams.map(resetTeamRound),
      }
    case 'REVEAL_HINT':
      return { ...s, hintsRevealed: Math.min(4, s.hintsRevealed + 1) }
    case 'RECORD_ANSWER':
      if (s.phase !== 'question' || s.answers[a.teamId]) return s
      return { ...s, answers: { ...s.answers, [a.teamId]: a.answer } }
    case 'SHOW_ANSWER':
      if (s.phase !== 'question') return s
      return {
        ...s,
        phase: 'reveal',
        hintsRevealed: 4,
        teams: s.teams.map((t) => {
          const ans = s.answers[t.id]
          const gain = ans?.correct ? ans.points : 0
          return { ...t, score: t.score + gain, lastGain: gain, lastCorrect: ans ? ans.correct : null, lastValue: ans?.value ?? null }
        }),
      }
    case 'END_GAME':
      return { ...s, phase: 'final' }
    case 'RESTART':
      return { ...s, phase: 'lobby', qIndex: 0, answers: {}, teams: s.teams.map((t) => ({ ...resetTeamRound(t), score: 0 })) }
    case 'CLOSE':
      return { ...initialState, mode: s.mode, duration: s.duration }
    default:
      return s
  }
}

export function questionsFor(mode) {
  return MODES[mode].questions
}

/** What players are allowed to see. Correct answers stay on the host until reveal. */
export function publicSnapshot(s) {
  const questions = questionsFor(s.mode)
  const q = questions[s.qIndex]
  const inGame = s.phase === 'question' || s.phase === 'reveal' || s.phase === 'final'
  const showAnswer = s.phase === 'reveal' || s.phase === 'final'
  let question = null
  if (inGame && q) {
    question =
      s.mode === 'clues'
        ? { id: q.id, category: q.category, hints: q.hints.slice(0, showAnswer ? 4 : s.hintsRevealed) }
        : { id: q.id, prompt: q.prompt, options: q.options }
  }
  return {
    roomCode: s.roomCode,
    mode: s.mode,
    duration: s.duration,
    phase: s.phase,
    qIndex: s.qIndex,
    total: questions.length,
    startedAt: s.startedAt,
    endsAt: s.startedAt + s.duration * 1000,
    hintsRevealed: s.hintsRevealed,
    question,
    answer: showAnswer && q ? (s.mode === 'clues' ? { text: q.answer } : { index: q.correct }) : null,
    teams: s.teams.map((t) => ({
      id: t.id,
      name: t.name,
      kit: t.kit,
      number: t.number,
      score: t.score,
      joinedAt: t.joinedAt,
      lastGain: t.lastGain,
      lastCorrect: t.lastCorrect,
      answered: Boolean(s.answers[t.id]),
    })),
  }
}

export function useHostGame() {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const stateRef = useRef(state)
  stateRef.current = state
  const pendingEvent = useRef(EVENTS.STATE_SYNC)

  const handleMessage = (msg) => {
    const s = stateRef.current
    const { type, payload = {} } = msg
    if (!s.roomCode || s.phase === 'setup') return

    if (type === EVENTS.REQUEST_STATE) {
      send(EVENTS.STATE_SYNC, { state: publicSnapshot(s) })
      return
    }

    if (type === EVENTS.PLAYER_JOINED) {
      const { teamId } = payload
      const name = String(payload.name ?? '').trim().slice(0, 24)
      const existing = s.teams.find((t) => t.id === teamId)
      if (existing) {
        send(EVENTS.JOIN_ACCEPTED, { teamId, team: existing, state: publicSnapshot(s) })
        return
      }
      let reason = null
      if (!name) reason = 'empty'
      else if (s.teams.some((t) => normalizeAnswer(t.name) === normalizeAnswer(name))) reason = 'taken'
      else if (s.teams.length >= MAX_TEAMS) reason = 'full'
      if (reason) {
        send(EVENTS.JOIN_REJECTED, { teamId, reason })
        return
      }
      const number = s.teams.reduce((max, t) => Math.max(max, t.number), 0) + 1
      const team = { id: teamId, name, number, kit: kitFor(number - 1), score: 0, joinedAt: Date.now(), lastGain: 0, lastCorrect: null, lastValue: null }
      act({ type: 'ADD_TEAM', team }, EVENTS.PLAYER_JOINED)
      send(EVENTS.JOIN_ACCEPTED, { teamId, team })
      return
    }

    if (type === EVENTS.PLAYER_ANSWERED) {
      const { teamId, qIndex, value } = payload
      const now = Date.now()
      const endsAt = s.startedAt + s.duration * 1000
      if (!s.teams.some((t) => t.id === teamId)) return
      const prior = s.answers[teamId]
      if (prior && qIndex === s.qIndex) {
        send(EVENTS.ANSWER_RESULT, { teamId, qIndex, correct: prior.correct, points: prior.points })
        return
      }
      if (s.phase !== 'question' || qIndex !== s.qIndex || now >= endsAt) {
        send(EVENTS.ANSWER_RESULT, { teamId, qIndex, late: true })
        return
      }
      const q = questionsFor(s.mode)[s.qIndex]
      const correct = s.mode === 'clues' ? isAnswerMatch(value, q.accept) : Number(value) === q.correct
      const available = pointsAt(endsAt - now, s.duration * 1000)
      const answer = { value, correct, points: correct ? available : 0, at: now }
      act({ type: 'RECORD_ANSWER', teamId, answer }, EVENTS.PLAYER_ANSWERED)
      send(EVENTS.ANSWER_RESULT, { teamId, qIndex, correct, points: answer.points })
    }
  }

  const { send } = useMultiplayerSync(state.roomCode, handleMessage)

  const act = useCallback((action, event = EVENTS.STATE_SYNC) => {
    pendingEvent.current = event
    dispatch(action)
  }, [])

  // Persist (survives a host refresh) and broadcast every state change.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* private mode */
    }
    if (state.roomCode && state.phase !== 'setup') {
      send(pendingEvent.current, { state: publicSnapshot(state) })
    }
    pendingEvent.current = EVENTS.STATE_SYNC
  }, [state, send])

  const total = questionsFor(state.mode).length

  const actions = {
    setMode: (mode) => act({ type: 'SET_MODE', mode }),
    setDuration: (duration) => act({ type: 'SET_DURATION', duration }),
    openRoom: () => act({ type: 'OPEN_ROOM' }, EVENTS.ROOM_CREATED),
    backToSetup: () => act({ type: 'BACK_TO_SETUP' }),
    kick: (id) => act({ type: 'REMOVE_TEAM', id }),
    start: () => act({ type: 'START_QUESTION', qIndex: 0, at: Date.now() }, EVENTS.GAME_STARTED),
    revealHint: () => act({ type: 'REVEAL_HINT' }, EVENTS.HINT_REVEALED),
    showAnswer: () => act({ type: 'SHOW_ANSWER' }, EVENTS.ANSWER_REVEALED),
    next: () => {
      const s = stateRef.current
      if (s.qIndex + 1 >= total) act({ type: 'END_GAME' }, EVENTS.GAME_ENDED)
      else act({ type: 'START_QUESTION', qIndex: s.qIndex + 1, at: Date.now() }, EVENTS.NEXT_QUESTION)
    },
    restart: () => act({ type: 'RESTART' }),
    close: () => {
      send(EVENTS.ROOM_CLOSED, {})
      act({ type: 'CLOSE' })
    },
  }

  return { state, actions, total, question: questionsFor(state.mode)[state.qIndex] }
}
