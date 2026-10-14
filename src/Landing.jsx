import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Projector, Smartphone, MonitorSmartphone } from 'lucide-react'
import { Button, LangToggle, BoardLabel } from './components/ui.jsx'
import Ticker from './components/Ticker.jsx'
import CodeInput from './components/CodeInput.jsx'
import PitchLines from './components/PitchLines.jsx'
import SevenSeg from './components/SevenSeg.jsx'
import { useLang } from './lib/i18n.jsx'
import { pop, useNow } from './lib/motion.js'

export default function Landing({ navigate }) {
  const { t } = useLang()
  const [code, setCode] = useState('')
  const now = useNow(true, 1000)
  const d = new Date(now)
  const clock = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

  const join = (e) => {
    e.preventDefault()
    if (code.length === 6) navigate(`/join/${code}`)
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden pitch-stripes">
      <PitchLines />

      <header className="relative z-10">
        <div className="flex items-center justify-between gap-4 bg-board px-4 py-3 sm:px-8">
          <span className="font-display text-2xl font-black tracking-[0.08em] text-white uppercase">
            Matchday<span className="text-led">.</span>quiz
          </span>
          <LangToggle />
        </div>
        <Ticker items={[t('landing.ticker1'), t('landing.ticker2'), t('landing.ticker3'), t('landing.ticker4')]} className="border-t border-white/5" />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
        <motion.section
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...pop, delay: 0.05 }}
          aria-labelledby="landing-title"
          className="w-full max-w-6xl rounded-[28px] bg-board p-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)] sm:p-4"
        >
          <div className="flex items-center justify-between gap-4 px-3 pt-1 pb-3">
            <h1 id="landing-title" className="font-display text-base font-extrabold tracking-[0.2em] text-board-text uppercase sm:text-lg">
              {t('landing.title')}
            </h1>
            <SevenSeg value={clock} className="h-7 text-led" label={clock} />
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
            {/* HOST — home side */}
            <div className="order-3 flex flex-col rounded-2xl bg-board-2 p-6 led-lattice md:order-1 sm:p-8">
              <h2 className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.9] font-black text-white uppercase">
                {t('landing.hostTitle')}
              </h2>
              <p className="mt-3 flex items-center gap-2">
                <Projector className="size-5 text-led" aria-hidden="true" />
                <BoardLabel>{t('landing.hostSide')}</BoardLabel>
              </p>
              <p className="mt-4 max-w-sm text-lg leading-snug text-board-text">{t('landing.hostBody')}</p>
              <div className="mt-auto pt-8">
                <Button size="lg" onClick={() => navigate('/host')} className="w-full sm:w-auto">
                  {t('landing.hostCta')}
                  <ArrowRight className="size-6" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="order-2 flex items-center justify-center py-1 md:px-2">
              <span className="font-display text-4xl font-black text-led [text-shadow:0_0_18px_rgb(255_180_0/0.5)] md:text-6xl">VS</span>
            </div>

            {/* JOIN — away side */}
            <form onSubmit={join} className="order-1 flex flex-col rounded-2xl bg-board-2 p-6 led-lattice md:order-3 sm:p-8">
              <h2 className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.9] font-black text-white uppercase">
                {t('landing.joinTitle')}
              </h2>
              <p className="mt-3 flex items-center gap-2">
                <Smartphone className="size-5 text-led" aria-hidden="true" />
                <BoardLabel>{t('landing.joinSide')}</BoardLabel>
              </p>
              <p className="mt-4 mb-6 text-lg leading-snug text-board-text">{t('landing.joinBody')}</p>
              <CodeInput value={code} onChange={setCode} label={t('join.codeLabel')} />
              <Button type="submit" variant="pitch" size="lg" disabled={code.length !== 6} className="mt-6 w-full">
                {t('landing.joinCta')}
                <ArrowRight className="size-6" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </motion.section>

        {/* Scoreboard posts */}
        <div className="flex w-full max-w-6xl justify-around" aria-hidden="true">
          <span className="h-10 w-5 bg-board/90" />
          <span className="h-10 w-5 bg-board/90" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...pop, delay: 0.3 }}
          className="mt-2 flex max-w-2xl items-start gap-3 rounded-2xl bg-pitch-2/90 px-5 py-4 text-base leading-snug text-chalk ring-1 ring-chalk/25"
        >
          <MonitorSmartphone className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <span>{t('landing.tabTip')}</span>
        </motion.p>
      </main>
    </div>
  )
}
