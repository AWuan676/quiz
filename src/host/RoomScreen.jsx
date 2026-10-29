import { AnimatePresence, motion } from 'framer-motion'
import { LoaderCircle, LogOut } from 'lucide-react'
import { useHostRoom } from './useHostRoom.js'
import Lobby from './Lobby.jsx'
import Game from './Game.jsx'
import Final from './Final.jsx'
import { Brand, Button, LangToggle } from '../components/ui.jsx'
import { useLang } from '../lib/i18n.jsx'

export default function RoomScreen({ code, user, navigate }) {
  const { t } = useLang()
  const game = useHostRoom(code)
  const { room, missing, meta, state, quiz, actions } = game

  const close = async () => {
    if (!window.confirm(t('host.exitConfirm'))) return
    await actions.close()
    navigate('/host')
  }

  let body
  if (missing) {
    body = (
      <div className="mx-auto max-w-xl px-5 py-16">
        <p className="display text-3xl">{t('room.gone')}</p>
        <Button size="md" variant="outline" className="mt-6" onClick={() => navigate('/host')}>
          {t('library.title')}
        </Button>
      </div>
    )
  } else if (!room || !quiz) {
    body = (
      <p className="flex items-center gap-3 px-10 py-10 text-ink-2">
        <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> {t('common.loading')}
      </p>
    )
  } else if (meta.hostUid !== user.uid) {
    body = <p className="px-10 py-10 text-lg">{t('room.notOwner')}</p>
  } else if (state.phase === 'lobby') {
    body = <Lobby game={game} />
  } else if (state.phase === 'final') {
    body = <Final game={game} />
  } else {
    body = <Game game={game} />
  }

  const key = state?.phase === 'reveal' ? 'question' : state?.phase || 'loading'

  return (
    <>
      <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-4 sm:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <Brand />
          {meta && (
            <span className="hidden truncate rounded-full bg-paper px-4 py-1.5 text-sm font-semibold ring-2 ring-inset ring-ink/10 sm:inline">
              {meta.title} · <span className="tabular">{code}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LangToggle />
          {room && (
            <button type="button" onClick={close} className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold uppercase transition-colors hover:bg-ink/5">
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t('host.closeRoom')}</span>
            </button>
          )}
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-1 flex-col"
        >
          {body}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
