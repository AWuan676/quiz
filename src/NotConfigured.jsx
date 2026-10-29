import { Wrench } from 'lucide-react'
import { Button, Brand, LangToggle } from './components/ui.jsx'
import { useLang } from './lib/i18n.jsx'

/** Shown until src/firebaseConfig.js holds a real Firebase project. */
export default function NotConfigured({ navigate }) {
  const { t } = useLang()
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <Brand />
        <LangToggle />
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 pb-16">
        <span className="grid size-14 place-items-center rounded-full bg-sun">
          <Wrench className="size-6" aria-hidden="true" />
        </span>
        <h1 className="display mt-6 text-4xl">{t('setupNeeded.title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">{t('setupNeeded.body')}</p>
        <Button variant="outline" size="md" className="mt-8 self-start" onClick={() => navigate('/')}>
          {t('common.home')}
        </Button>
      </main>
    </div>
  )
}
