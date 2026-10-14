import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { usePlayerGame } from './usePlayerGame.js'
import { JoinScreen, TeamScreen, ClosedScreen } from './JoinScreens.jsx'
import { WaitingScreen, ControllerScreen, FeedbackScreen, RevealScreen, FinalScreen, TimeUpScreen } from './PlayScreens.jsx'
import { LangToggle, TeamBlob, Brand } from '../components/ui.jsx'
import { useLang } from '../lib/i18n.jsx'
import { useNow } from '../lib/motion.js'

export default function PlayerApp({ initialCode, navigate }) {
  const { t } = useLang()
  const game = useGameView(initialCode)
  const { step, room, me } = game

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
              <TeamBlob kit={me.kit} number={me.number} className="size-11" textClass="text-lg" />
              <div className="min-w-0">
                <p className="truncate text-base leading-tight font-semibold">{me.name}</p>
                {room && <p className="text-xs font-semibold text-ink-2 tabular">{t('lobby.codeLabel')} {room.roomCode}</p>}
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

/** Picks the one screen this team should see right now. */
function useGameView(initialCode) {
  const g = usePlayerGame(initialCode)
  const { step, room, results, pending } = g
  const live = step === 'in' && room?.phase === 'question'
  const now = useNow(live, 100)

  if (step === 'closed') return { ...g, screenKey: 'closed', screen: <ClosedScreen onLeave={g.leave} /> }
  if (step === 'code' || step === 'checking') return { ...g, screenKey: 'code', screen: <JoinScreen game={g} /> }
  if (step === 'team' || (step === 'joining' && !g.me)) return { ...g, screenKey: 'team', screen: <TeamScreen game={g} /> }
  if (!room || room.phase === 'lobby' || room.phase === 'setup') {
    return { ...g, screenKey: 'wait', screen: <WaitingScreen game={g} /> }
  }
  if (room.phase === 'final') return { ...g, screenKey: 'final', screen: <FinalScreen game={g} /> }
  if (room.phase === 'reveal') return { ...g, screenKey: `reveal-${room.qIndex}`, screen: <RevealScreen game={g} /> }

  const result = results[room.qIndex]
  const remainingMs = Math.max(0, room.endsAt - now)
  if (result) return { ...g, screenKey: `fb-${room.qIndex}`, screen: <FeedbackScreen game={g} result={result} /> }
  if (pending?.qIndex === room.qIndex) return { ...g, screenKey: `fb-${room.qIndex}`, screen: <FeedbackScreen game={g} result={null} /> }
  if (remainingMs <= 0) return { ...g, screenKey: `late-${room.qIndex}`, screen: <TimeUpScreen /> }
  return { ...g, screenKey: `q-${room.qIndex}`, screen: <ControllerScreen game={g} remainingMs={remainingMs} /> }
}
