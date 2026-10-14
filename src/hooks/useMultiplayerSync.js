import { useCallback, useEffect, useRef } from 'react'

/**
 * Every message that crosses between Host and Player tabs.
 * The host is authoritative: players only *ask* (JOIN, ANSWER, REQUEST_STATE);
 * the host decides and re-broadcasts a full public snapshot with each event.
 */
export const EVENTS = {
  // host -> players (all carry payload.state, the public room snapshot)
  ROOM_CREATED: 'ROOM_CREATED',
  STATE_SYNC: 'STATE_SYNC',
  GAME_STARTED: 'GAME_STARTED',
  NEXT_QUESTION: 'NEXT_QUESTION',
  HINT_REVEALED: 'HINT_REVEALED',
  ANSWER_REVEALED: 'ANSWER_REVEALED',
  GAME_ENDED: 'GAME_ENDED',
  ROOM_CLOSED: 'ROOM_CLOSED',
  // host -> one team
  JOIN_ACCEPTED: 'JOIN_ACCEPTED',
  JOIN_REJECTED: 'JOIN_REJECTED',
  ANSWER_RESULT: 'ANSWER_RESULT',
  // players -> host
  REQUEST_STATE: 'REQUEST_STATE',
  PLAYER_JOINED: 'PLAYER_JOINED',
  PLAYER_ANSWERED: 'PLAYER_ANSWERED',
}

const CLIENT_ID = Math.random().toString(36).slice(2, 10)

/**
 * Transport adapter. BroadcastChannel syncs tabs of the same browser.
 * Older browsers fall back to localStorage 'storage' events.
 *
 * To go multi-device, replace ONLY this function with a WebSocket /
 * Supabase Realtime / Firebase / PartyKit client exposing the same
 * { post(message), close() } shape and calling onMessage(message).
 */
function openTransport(channelName, onMessage) {
  if (typeof BroadcastChannel !== 'undefined') {
    const ch = new BroadcastChannel(channelName)
    ch.onmessage = (e) => onMessage(e.data)
    return { post: (msg) => ch.postMessage(msg), close: () => ch.close() }
  }
  const key = `mq-bus:${channelName}`
  const onStorage = (e) => {
    if (e.key !== key || !e.newValue) return
    try {
      onMessage(JSON.parse(e.newValue))
    } catch {
      /* ignore malformed */
    }
  }
  window.addEventListener('storage', onStorage)
  return {
    post: (msg) => {
      try {
        localStorage.setItem(key, JSON.stringify({ ...msg, nonce: Math.random() }))
      } catch {
        /* storage unavailable */
      }
    },
    close: () => window.removeEventListener('storage', onStorage),
  }
}

/**
 * useMultiplayerSync(roomCode, onMessage)
 *  - opens one channel per room ("matchday:<code>")
 *  - returns send(type, payload) and a stable clientId
 *  - onMessage may change every render; the latest one is always used
 */
export function useMultiplayerSync(roomCode, onMessage) {
  const transportRef = useRef(null)
  const handlerRef = useRef(onMessage)
  handlerRef.current = onMessage

  useEffect(() => {
    if (!roomCode) return undefined
    const transport = openTransport(`matchday:${roomCode}`, (msg) => {
      if (!msg || msg.sender === CLIENT_ID) return
      handlerRef.current?.(msg)
    })
    transportRef.current = transport
    return () => {
      transport.close()
      if (transportRef.current === transport) transportRef.current = null
    }
  }, [roomCode])

  const send = useCallback((type, payload = {}) => {
    transportRef.current?.post({ type, payload, sender: CLIENT_ID, ts: Date.now() })
  }, [])

  return { send, clientId: CLIENT_ID }
}
