import { useEffect, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import { KITS } from './kits.js'

/**
 * Realtime Database layout, one node per room:
 *
 * rooms/{code}
 *   meta      { hostUid, quizId, title, mode, duration, total, maxTeam, createdAt }   host
 *   state     { phase: lobby|question|reveal|final|closed, qIndex, startedAt, hintsRevealed } host
 *   question  public part of the current question (revealed hints only)              host
 *   reveal    { text } | { index }  written when the host shows the answer           host
 *   players/{uid}  { name, avatar, teamId, joinedAt, online }                        that player (or host)
 *   invites/{toUid}/{fromUid}  { teamId, fromName, at }                              sender / receiver
 *   teams/{teamId} { members{uid:name}, kit, score, lastGain, lastCorrect, lastValue } host (frozen at start)
 *   answers/{q}/{teamId} { uid, name, value, at }   write-once, any member           players
 *   results/{q}/{teamId} { correct, points, late }                                   host
 */
export const roomPath = (code, path = '') => `rooms/${code}${path ? `/${path}` : ''}`
export const roomRef = (db, code, path) => ref(db, roomPath(code, path))

/** The parts of a room any player may read. Each player's private hints live elsewhere (hints/{uid}). */
export const PUBLIC_KEYS = ['meta', 'state', 'question', 'reveal', 'players', 'invites', 'teams', 'answers', 'results']

/**
 * Live room data. `missing` is true once we know the room does not exist.
 * The host reads the whole room; players subscribe to the public children only,
 * because the security rules keep each player's hints private.
 */
export function useRoom(db, code, keys = null) {
  const [room, setRoom] = useState(null)
  const [missing, setMissing] = useState(false)
  const keyList = keys ? keys.join(',') : ''
  useEffect(() => {
    if (!db || !code) return undefined
    setMissing(false)
    if (!keyList) {
      return onValue(
        roomRef(db, code),
        (snap) => {
          setRoom(snap.val())
          setMissing(!snap.exists())
        },
        () => setMissing(true),
      )
    }
    const data = {}
    const unsubs = keyList.split(',').map((key) =>
      onValue(
        roomRef(db, code, key),
        (snap) => {
          data[key] = snap.val()
          if (key === 'meta') setMissing(!snap.exists())
          setRoom({ ...data })
        },
        () => key === 'meta' && setMissing(true),
      ),
    )
    return () => unsubs.forEach((u) => u())
  }, [db, code, keyList])
  return { room, missing }
}

/**
 * Convergent Clues in teams: each member gets one clue, picked at random without
 * repeats from the 4 (a solo player gets 1 random clue, a pair 2 different ones,
 * a full team all 4). The draw is fresh for every team and every question.
 * Returns { uid: { q, items: [{ n, text }] } }.
 */
export function dealHints(hints, memberUids, qIndex) {
  const order = hints.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const out = {}
  memberUids.forEach((uid, i) => {
    const pick = order[i]
    out[uid] = { q: qIndex, items: pick !== undefined ? [{ n: pick + 1, text: hints[pick] }] : [] }
  })
  return out
}

/** Team members in join order, so each player keeps the same hint slot all game. */
export function orderedMembers(team, players = {}) {
  return Object.keys(team?.members || {}).sort((a, b) => (players[a]?.joinedAt ?? 0) - (players[b]?.joinedAt ?? 0))
}

export const CLUES_TEAM_SIZE = 4

/** Date.now() corrected to the Firebase server clock, ticking while `active`. */
export function useServerNow(db, active = true, interval = 100) {
  const [offset, setOffset] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!db) return undefined
    return onValue(ref(db, '.info/serverTimeOffset'), (s) => setOffset(s.val() || 0))
  }, [db])
  useEffect(() => {
    if (!active) return undefined
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [active, interval])
  return now + offset
}

export function hashKit(id = '') {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h % KITS.length
}

/** Players grouped by the team they picked in the lobby: [{ teamId, members: [player…] }]. */
export function groupPlayers(players) {
  const groups = new Map()
  // Firebase returns null (not undefined) for an empty node, so default parameters don't help.
  Object.entries(players || {}).forEach(([uid, p]) => {
    if (!p?.name) return // a stray presence write after a kick
    const teamId = p.teamId || uid
    if (!groups.has(teamId)) groups.set(teamId, [])
    groups.get(teamId).push({ uid, ...p })
  })
  return [...groups.entries()]
    .map(([teamId, members]) => ({ teamId, members: members.sort((a, b) => a.joinedAt - b.joinedAt) }))
    .sort((a, b) => a.members[0].joinedAt - b.members[0].joinedAt)
}

export const teamName = (memberNames) => memberNames.join(' · ')

/** Frozen teams as a ranked array with display fields. */
export function rankedTeams(teams) {
  return Object.entries(teams || {})
    .map(([id, t]) => ({
      id,
      ...t,
      name: teamName(Object.values(t.members || {})),
      kit: KITS[t.kit ?? 0],
      score: t.score || 0,
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .map((t, i) => ({ ...t, number: i + 1 }))
}

export function generateRoomCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}
