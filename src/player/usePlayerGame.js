import { useCallback, useEffect, useRef, useState } from 'react'
import { EVENTS, useMultiplayerSync } from '../hooks/useMultiplayerSync.js'

const SESSION_KEY = 'mq-player'

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {}
  } catch {
    return {}
  }
}

function saveSession(data) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
  } catch {
    /* private mode */
  }
}

const newTeamId = () => `t_${Math.random().toString(36).slice(2, 10)}`

/**
 * Player state machine:
 *   code → checking → team → joining → in
 * Once "in", the screen follows room.phase broadcast by the host.
 */
export function usePlayerGame(initialCode) {
  const session = useRef(loadSession()).current
  const resume = session.code && session.teamId && (!initialCode || initialCode === session.code)

  const [code, setCode] = useState(resume ? session.code : initialCode)
  const [activeCode, setActiveCode] = useState(resume ? session.code : null)
  const [step, setStep] = useState(resume ? 'joining' : 'code')
  const [teamId] = useState(() => (resume ? session.teamId : newTeamId()))
  const [teamName, setTeamName] = useState(resume ? session.teamName : '')
  const [room, setRoom] = useState(null)
  const [error, setError] = useState(null)
  const [results, setResults] = useState({})
  const [pending, setPending] = useState(null)
  const stepRef = useRef(step)
  stepRef.current = step

  const handleMessage = ({ type, payload = {} }) => {
    if (payload.state && payload.state.roomCode === activeCode) {
      const next = payload.state
      setRoom(next)
      if (stepRef.current === 'checking') setStep('team')
      if (stepRef.current === 'in' && !next.teams.some((t) => t.id === teamId)) {
        setStep('team')
        setError('kicked')
      }
      if (type === EVENTS.NEXT_QUESTION || type === EVENTS.GAME_STARTED) setPending(null)
      if (type === EVENTS.GAME_STARTED) setResults({})
    }
    if (payload.teamId && payload.teamId !== teamId) return

    switch (type) {
      case EVENTS.JOIN_ACCEPTED:
        setStep('in')
        setError(null)
        setTeamName(payload.team.name)
        saveSession({ code: activeCode, teamId, teamName: payload.team.name })
        break
      case EVENTS.JOIN_REJECTED:
        setStep('team')
        setError(payload.reason)
        break
      case EVENTS.ANSWER_RESULT:
        setResults((r) => ({ ...r, [payload.qIndex]: payload }))
        if (navigator.vibrate) navigator.vibrate(payload.correct ? 60 : [90, 60, 90])
        break
      case EVENTS.ROOM_CLOSED:
        setStep('closed')
        saveSession({})
        break
      default:
    }
  }

  const { send } = useMultiplayerSync(activeCode, handleMessage)

  // Look for the room; no host reply in 1.5s means the code is wrong.
  useEffect(() => {
    if (step !== 'checking') return undefined
    send(EVENTS.REQUEST_STATE, { roomCode: activeCode })
    const id = setTimeout(() => {
      if (stepRef.current === 'checking') {
        setStep('code')
        setError('notFound')
        setActiveCode(null)
      }
    }, 1500)
    return () => clearTimeout(id)
  }, [step, activeCode, send])

  // Join (or silently re-join after a refresh).
  useEffect(() => {
    if (step !== 'joining') return undefined
    send(EVENTS.PLAYER_JOINED, { teamId, name: teamName })
    const id = setTimeout(() => {
      if (stepRef.current === 'joining') {
        setStep(room ? 'team' : 'code')
        setError('noHost')
      }
    }, 2000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const findRoom = useCallback(() => {
    if (code.length !== 6) return
    setError(null)
    setActiveCode(code)
    setStep('checking')
  }, [code])

  const joinTeam = useCallback((name) => {
    const clean = name.trim()
    if (!clean) {
      setError('empty')
      return
    }
    setError(null)
    setTeamName(clean)
    setStep('joining')
  }, [])

  const submitAnswer = useCallback(
    (value) => {
      if (!room || room.phase !== 'question') return
      setPending({ qIndex: room.qIndex, value })
      send(EVENTS.PLAYER_ANSWERED, { teamId, qIndex: room.qIndex, value })
    },
    [room, send, teamId],
  )

  const leave = useCallback(() => {
    saveSession({})
    setActiveCode(null)
    setRoom(null)
    setStep('code')
    setResults({})
    setPending(null)
  }, [])

  const me = room?.teams.find((t) => t.id === teamId) ?? null

  return {
    code,
    setCode,
    step,
    room,
    me,
    teamName,
    error,
    results,
    pending,
    findRoom,
    joinTeam,
    submitAnswer,
    leave,
  }
}
