import { AnimatePresence, motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { useHostGame } from './useHostGame.js'
import Setup from './Setup.jsx'
import Lobby from './Lobby.jsx'
import Game from './Game.jsx'
import Final from './Final.jsx'
import { LangToggle } from '../components/ui.jsx'
import { useLang } from '../lib/i18n.jsx'

export default function HostApp({ navigate }) {
  const { t } = useLang()
  const game = useHostGame()
  const { state, actions } = game

  const exit = () => {
    if (state.roomCode && state.teams.length > 0 && !window.confirm(t('host.exitConfirm'))) return
    actions.close()
    navigate('/')
  }

  let screen
  if (state.phase === 'setup') screen = <Setup key="setup" game={game} />
  else if (state.phase === 'lobby') screen = <Lobby key="lobby" game={game} />
  else if (state.phase === 'final') screen = <Final key="final" game={game} />
  else screen = <Game key="game" game={game} />

  return (
    <div className="flex min-h-dvh flex-col bg-concrete">
      <header className="flex items-center justify-between gap-4 bg-board px-4 py-3 sm:px-8">
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl font-black tracking-[0.08em] text-white uppercase">
            Matchday<span className="text-led">.</span>quiz
          </span>
          {state.roomCode && state.phase !== 'setup' && (
            <span className="hidden rounded-md bg-board-2 px-3 py-1 font-display text-lg font-extrabold tracking-[0.2em] text-led tabular sm:inline">
              #{state.roomCode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LangToggle />
          <button
            type="button"
            onClick={exit}
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 font-display text-base font-extrabold tracking-wide text-board-text uppercase transition-colors hover:bg-board-2 hover:text-white"
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{state.roomCode ? t('host.closeRoom') : t('common.home')}</span>
          </button>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.main
          key={screen.key}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-1 flex-col"
        >
          {screen}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
