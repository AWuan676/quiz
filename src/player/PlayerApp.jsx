import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { usePlayerRoom } from './usePlayerRoom.js'
import { JoinScreen, ProfileScreen, ClosedScreen } from './JoinScreens.jsx'
import LobbyScreen from './LobbyScreen.jsx'
import { ControllerScreen, FeedbackScreen, RevealScreen, FinalScreen, TimeUpScreen } from './PlayScreens.jsx'
import { LangToggle, Brand } from '../components/ui.jsx'
import Avatar from '../components/Avatar.jsx'
import { playerDb } from '../lib/firebase.js'
import { rankedTeams, useServerNow } from '../lib/room.js'
import { useLang } from '../lib/i18n.jsx'

export default function PlayerApp({ initialCode, navigate }) {
  const { t } = useLang()
  const game = useGameView(initialCode)
  const { step, rawRoom: room, player: me } = game

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {step !== 'in' && (
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label={t('common.home')}
              className="grid size-10 shrink-0 place-items-center rounded-full ring-2 ring-inset ring-ink/15 transition-colors hover:bg-ink/5"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
          )}
          {step === 'in' && me ? (
            <>
              <Avatar name={me.name} avatar={me.avatar} className="size-11" textClass="text-sm" />
              <div className="min-w-0">
                <p className="truncate text-base leading-tight font-semibold">{me.name}</p>
                {room?.meta && (
                  <p className="truncate text-xs font-semibold text-ink-2">
                    {room.meta.title} · <span className="tabular">{game.code}</span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <Brand />
          )}
        </div>
        <LangToggle />
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={game.screenKey}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-1 flex-col"
        >
          {game.screen}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

/** Picks the one screen this player should see right now. */
function useGameView(initialCode) {
  const raw = usePlayerRoom(initialCode)
  const g = { ...raw, player: raw.me, rawRoom: raw.room }
  const { step, room, me } = raw
  const state = room?.state
  const live = step === 'in' && state?.phase === 'question'
  const now = useServerNow(playerDb, live, 100)

  if (step === 'closed') return { ...g, screenKey: 'closed', screen: <ClosedScreen onLeave={g.leaveRoom} /> }
  if (step === 'code') return { ...g, screenKey: 'code', screen: <JoinScreen game={g} /> }
  if (step === 'profile') return { ...g, screenKey: 'profile', screen: <ProfileScreen game={g} /> }
  if (!room?.meta || !state || !me || state.phase === 'lobby') {
    return { ...g, screenKey: 'lobby', screen: <LobbyScreen game={g} /> }
  }

  // Shape the room for the game screens: the player's unit of play is their team.
  const teams = rankedTeams(room.teams)
  const team = teams.find((tm) => tm.id === me.teamId) || null
  const q = state.qIndex
  const answer = room.answers?.[q]?.[me.teamId]
  const view = {
    ...g,
    room: {
      mode: room.meta.mode,
      duration: room.meta.duration,
      total: room.meta.total,
      qIndex: q,
      endsAt: state.startedAt + room.meta.duration * 1000,
      question: room.question,
      answer: room.reveal,
      teams,
    },
    me: team ? { ...team, memberCount: Object.keys(team.members || {}).length } : null,
    pending: answer ? { qIndex: q, value: answer.value } : null,
    answeredBy: answer && answer.uid !== me.uid ? answer.name : null,
  }

  if (state.phase === 'final') return { ...view, screenKey: 'final', screen: <FinalScreen game={view} /> }
  if (state.phase === 'reveal') return { ...view, screenKey: `reveal-${q}`, screen: <RevealScreen game={view} /> }

  const result = room.results?.[q]?.[me.teamId]
  const remainingMs = Math.max(0, view.room.endsAt - now)
  if (result) return { ...view, screenKey: `fb-${q}`, screen: <FeedbackScreen game={view} result={result} /> }
  if (answer) return { ...view, screenKey: `fb-${q}`, screen: <FeedbackScreen game={view} result={null} /> }
  if (remainingMs <= 0) return { ...view, screenKey: `late-${q}`, screen: <TimeUpScreen /> }
  return { ...view, screenKey: `q-${q}`, screen: <ControllerScreen game={view} remainingMs={remainingMs} /> }
}
