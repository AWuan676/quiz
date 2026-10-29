import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { onAuthStateChanged } from 'firebase/auth'
import { LogOut } from 'lucide-react'
import { hostAuth, signInHostWithGoogle, signOutHost } from '../lib/firebase.js'
import { LangToggle, Brand, Button } from '../components/ui.jsx'
import { CornerLobe } from '../components/Lobe.jsx'
import Library from './Library.jsx'
import Editor from './Editor.jsx'
import RoomScreen from './RoomScreen.jsx'
import { useLang } from '../lib/i18n.jsx'
import { pop } from '../lib/motion.js'

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

function SignIn() {
  const { t } = useLang()
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const go = async () => {
    setBusy(true)
    setError(null)
    try {
      await signInHostWithGoogle()
    } catch (e) {
      if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') setError(t('signin.error'))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 pb-20">
      <CornerLobe corner="br" color="var(--color-sun)" className="fixed -right-[12vw] -bottom-[14vw] w-[min(40vw,520px)] max-md:hidden" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={pop} className="relative">
        <h1 className="display text-[clamp(2.5rem,6vw,4rem)]">{t('signin.title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">{t('signin.body')}</p>
        <Button variant="ink" size="lg" className="mt-8" onClick={go} disabled={busy}>
          <span className="grid size-8 place-items-center rounded-full bg-water">
            <GoogleMark />
          </span>
          {t('signin.cta')}
        </Button>
        {error && (
          <p role="alert" className="mt-4 rounded-3xl bg-coral/25 px-4 py-3 text-sm font-semibold">
            {error}
          </p>
        )}
      </motion.div>
    </div>
  )
}

export default function HostApp({ path, navigate }) {
  const { t } = useLang()
  const [user, setUser] = useState(undefined)

  useEffect(() => onAuthStateChanged(hostAuth, setUser), [])

  const editMatch = path.match(/^\/host\/edit\/([\w-]+)/)
  const roomMatch = path.match(/^\/host\/room\/(\d{6})/)
  const inRoom = Boolean(roomMatch)

  let screen = null
  let key = 'loading'
  if (user === null) {
    screen = <SignIn />
    key = 'signin'
  } else if (user) {
    if (roomMatch) {
      key = `room-${roomMatch[1]}`
      screen = <RoomScreen code={roomMatch[1]} user={user} navigate={navigate} />
    } else if (editMatch) {
      key = `edit-${editMatch[1]}`
      screen = <Editor quizId={editMatch[1]} user={user} navigate={navigate} />
    } else {
      key = 'library'
      screen = <Library user={user} navigate={navigate} />
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      {!inRoom && (
        <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-4 sm:px-10">
          <button type="button" onClick={() => navigate(user ? '/host' : '/')} className="rounded-full">
            <Brand />
          </button>
          <div className="flex items-center gap-3">
            <LangToggle />
            {user && (
              <button
                type="button"
                onClick={() => signOutHost().then(() => navigate('/host'))}
                className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors hover:bg-ink/5"
                title={user.email ?? ''}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="size-7 rounded-full" referrerPolicy="no-referrer" />
                ) : null}
                <span className="hidden sm:inline">{t('signin.out')}</span>
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </header>
      )}
      <AnimatePresence mode="wait">
        <motion.main
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-1 flex-col"
        >
          {screen}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
