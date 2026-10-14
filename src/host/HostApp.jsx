import { AnimatePresence, motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { useHostGame } from './useHostGame.js'
import Setup from './Setup.jsx'
import Lobby from './Lobby.jsx'
import Game from './Game.jsx'
import Final from './Final.jsx'
import { LangToggle, Brand } from '../components/ui.jsx'
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
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-4 sm:px-10">
        <div className="flex items-center gap-4">
          <Brand />
          {state.roomCode && state.phase !== 'setup' && (
            <span className="hidden rounded-full bg-paper px-4 py-1.5 text-sm font-semibold tabular ring-2 ring-inset ring-ink/10 sm:inline">
              {t('lobby.codeLabel')} {state.roomCode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LangToggle />
          <button
            type="button"
            onClick={exit}
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold uppercase transition-colors hover:bg-ink/5"
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
          className="relative flex flex-1 flex-col"
        >
          {screen}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
