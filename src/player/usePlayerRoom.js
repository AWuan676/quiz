import { useCallback, useEffect, useMemo, useState } from 'react'
import { get, onDisconnect, remove, serverTimestamp, set, update } from 'firebase/database'
import { ensurePlayerUser, playerDb } from '../lib/firebase.js'
import { groupPlayers, roomRef, useRoom } from '../lib/room.js'

const PROFILE_KEY = 'mq-profile'

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}
  } catch {
    return {}
  }
}

/**
 * Player state machine:
 *   code → checking → profile → (in room) lobby / game screens follow room.state.phase
 */
export function usePlayerRoom(initialCode) {
  const [uid, setUid] = useState(null)
  const [code, setCode] = useState(initialCode)
  const [activeCode, setActiveCode] = useState(null)
  const [step, setStep] = useState('code')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const profile = useMemo(loadProfile, [])

  const { room, missing } = useRoom(playerDb, activeCode)
  const me = uid && room?.players?.[uid] ? { uid, ...room.players[uid] } : null

  // Sign in anonymously once; resume straight into the room if this tab was already in it.
  useEffect(() => {
    let cancelled = false
    ensurePlayerUser()
      .then(async (user) => {
        if (cancelled) return
        setUid(user.uid)
        const last = sessionStorage.getItem('mq-room')
        if (last && (!initialCode || initialCode === last)) {
          const snap = await get(roomRef(playerDb, last, `players/${user.uid}`))
          if (snap.exists() && !cancelled) {
            setActiveCode(last)
            setCode(last)
            setStep('in')
          }
        }
      })
      .catch(() => !cancelled && setError('auth'))
    return () => {
      cancelled = true
    }
  }, [initialCode])

  // Presence: mark online, and offline when the phone drops.
  useEffect(() => {
    if (step !== 'in' || !uid || !activeCode) return undefined
    const onlineRef = roomRef(playerDb, activeCode, `players/${uid}/online`)
    set(onlineRef, true).catch(() => {})
    onDisconnect(onlineRef).set(false)
    return () => {
      onDisconnect(onlineRef).cancel()
    }
  }, [step, uid, activeCode])

  // Room closed, or this player was removed by the host.
  useEffect(() => {
    if (step !== 'in') return
    if (missing || room?.state?.phase === 'closed') {
      setStep('closed')
      sessionStorage.removeItem('mq-room')
    } else if (room && uid && !room.players?.[uid]) {
      setStep('profile')
      setError('kicked')
    }
  }, [step, missing, room, uid])

  const findRoom = useCallback(async () => {
    if (code.length !== 6 || !uid) return
    setBusy(true)
    setError(null)
    try {
      const snap = await get(roomRef(playerDb, code, 'meta'))
      if (!snap.exists()) {
        setError('notFound')
        return
      }
      setActiveCode(code)
      setStep('profile')
    } catch {
      setError('notFound')
    } finally {
      setBusy(false)
    }
  }, [code, uid])

  const join = useCallback(
    async ({ name, avatar }) => {
      const clean = name.trim().slice(0, 20)
      if (!clean) {
        setError('empty')
        return
      }
      const taken = Object.entries(room?.players || {}).some(([id, p]) => id !== uid && p.name.toLowerCase() === clean.toLowerCase())
      if (taken) {
        setError('taken')
        return
      }
      setBusy(true)
      setError(null)
      try {
        await set(roomRef(playerDb, activeCode, `players/${uid}`), {
          name: clean,
          avatar,
          teamId: uid,
          joinedAt: serverTimestamp(),
          online: true,
        })
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: clean, avatar }))
        sessionStorage.setItem('mq-room', activeCode)
        setStep('in')
      } catch {
        setError('joinFailed')
      } finally {
        setBusy(false)
      }
    },
    [activeCode, room, uid],
  )

  // ---- Team-up -------------------------------------------------------------
  const maxTeam = room?.meta?.maxTeam || 1
  const groups = useMemo(() => groupPlayers(room?.players), [room?.players])
  const myGroup = groups.find((g) => g.members.some((m) => m.uid === uid))
  const invites = Object.entries(room?.invites?.[uid] || {}).map(([fromUid, inv]) => ({ fromUid, ...inv }))

  const invite = useCallback(
    (toUid) => {
      if (!me) return Promise.resolve()
      return set(roomRef(playerDb, activeCode, `invites/${toUid}/${uid}`), {
        teamId: me.teamId,
        fromName: me.name,
        at: serverTimestamp(),
      })
    },
    [me, activeCode, uid],
  )

  const accept = useCallback(
    async (inv) => {
      // Join the inviter's team as it is now (they may have moved since inviting).
      const teamId = room?.players?.[inv.fromUid]?.teamId
      const size = groups.find((g) => g.teamId === teamId)?.members.length ?? 0
      if (!teamId || size >= maxTeam) {
        setError('teamFull')
        await remove(roomRef(playerDb, activeCode, `invites/${uid}/${inv.fromUid}`))
        return
      }
      await update(roomRef(playerDb, activeCode), {
        [`players/${uid}/teamId`]: teamId,
        [`invites/${uid}`]: null,
      })
    },
    [room?.players, groups, maxTeam, activeCode, uid],
  )

  const decline = useCallback((inv) => remove(roomRef(playerDb, activeCode, `invites/${uid}/${inv.fromUid}`)), [activeCode, uid])

  const leaveTeam = useCallback(() => set(roomRef(playerDb, activeCode, `players/${uid}/teamId`), uid), [activeCode, uid])

  // ---- Answering -----------------------------------------------------------
  const submitAnswer = useCallback(
    async (value) => {
      const st = room?.state
      if (!me || st?.phase !== 'question') return
      try {
        // Write-once in the rules: if a teammate got there first this fails, and
        // their answer shows up through the room listener instead.
        await set(roomRef(playerDb, activeCode, `answers/${st.qIndex}/${me.teamId}`), {
          uid,
          name: me.name,
          value,
          at: serverTimestamp(),
        })
      } catch {
        /* teammate answered first */
      }
    },
    [room?.state, me, activeCode, uid],
  )

  const leaveRoom = useCallback(async () => {
    if (activeCode && uid) await remove(roomRef(playerDb, activeCode, `players/${uid}`)).catch(() => {})
    sessionStorage.removeItem('mq-room')
    setActiveCode(null)
    setStep('code')
  }, [activeCode, uid])

  return {
    uid,
    code,
    setCode,
    step,
    error,
    setError,
    busy,
    room,
    me,
    profile,
    maxTeam,
    groups,
    myGroup,
    invites,
    findRoom,
    join,
    invite,
    accept,
    decline,
    leaveTeam,
    submitAnswer,
    leaveRoom,
  }
}
