import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, LangToggle, Brand } from './components/ui.jsx'
import CodeInput from './components/CodeInput.jsx'
import { CornerLobe, Blob } from './components/Lobe.jsx'
import { useLang } from './lib/i18n.jsx'
import { pop } from './lib/motion.js'

export default function Landing({ navigate }) {
  const { t } = useLang()
  const [code, setCode] = useState('')

  const join = (e) => {
    e.preventDefault()
    if (code.length === 6) navigate(`/join/${code}`)
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <CornerLobe corner="tr" className="absolute -top-[6vw] -right-[8vw] w-[min(62vw,820px)] max-md:w-[115vw] max-md:-right-[40vw] max-md:-top-[30vw]" />
      <CornerLobe corner="bl" color="var(--color-pond)" delay={0.15} className="absolute -bottom-[14vw] -left-[12vw] w-[min(30vw,380px)] max-md:hidden" />

      <header className="relative z-10 flex items-center justify-between gap-4 px-5 py-5 sm:px-10">
        <Brand />
        <LangToggle />
      </header>

      <main className="relative z-10 grid flex-1 items-center gap-12 px-5 pt-6 pb-16 sm:px-10 lg:grid-cols-[1.15fr_1fr]">
        <motion.form
          onSubmit={join}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={pop}
          className="max-w-xl"
        >
          <h1 className="display text-[clamp(3rem,7.5vw,6rem)] text-balance">{t('landing.title')}</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">{t('landing.joinBody')}</p>
          <div className="mt-8 max-w-md">
            <CodeInput value={code} onChange={setCode} label={t('join.codeLabel')} />
          </div>
          <Button type="submit" size="lg" chip disabled={code.length !== 6} className="mt-5 w-full max-w-md">
            {t('landing.joinCta')}
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...pop, delay: 0.2 }}
          className="relative flex flex-col items-start gap-5 justify-self-start lg:justify-self-end lg:pr-[4vw]"
        >
          <h2 className="display max-w-xs text-[clamp(1.75rem,3vw,2.5rem)]">{t('landing.hostTitle')}</h2>
          <p className="max-w-xs text-base leading-relaxed text-ink">{t('landing.hostBody')}</p>
          <Button variant="ink" size="lg" chip onClick={() => navigate('/host')}>
            {t('landing.hostCta')}
          </Button>
        </motion.div>
      </main>

      <footer className="relative z-10 flex items-start gap-3 px-5 pb-6 sm:px-10">
        <Blob variant={1} color="var(--color-lilac)" className="size-6 shrink-0" />
        <p className="max-w-2xl text-sm leading-relaxed text-ink-2">{t('landing.tabTip')}</p>
      </footer>
    </div>
  )
}
