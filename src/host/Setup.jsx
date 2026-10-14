import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight, DoorOpen } from 'lucide-react'
import { Button, BoardLabel } from '../components/ui.jsx'
import SevenSeg from '../components/SevenSeg.jsx'
import ShotClock from '../components/ShotClock.jsx'
import { TIME_OPTIONS, MODES } from '../data/quizzes.js'
import { ANSWER_PLATES } from '../lib/kits.js'
import { pointsAt } from '../lib/scoring.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

function CluesArt() {
  return (
    <div className="flex h-full items-center gap-3">
      <div className="flex flex-1 flex-col items-end gap-2">
        {[100, 84, 68, 52].map((w, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${w}%` }}
            transition={{ ...pop, delay: 0.1 + i * 0.08 }}
            className="flex h-6 items-center gap-2 rounded-md bg-board-3 px-2"
          >
            <span className="font-display text-sm font-black text-led">{i + 1}</span>
            <span className="h-1.5 flex-1 rounded-full bg-white/15" />
          </motion.div>
        ))}
      </div>
      <ChevronRight className="size-8 shrink-0 text-led" aria-hidden="true" />
      <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-led font-display text-5xl font-black text-ink">?</span>
    </div>
  )
}

function StandardArt() {
  return (
    <div className="grid h-full grid-cols-2 gap-2">
      {ANSWER_PLATES.map(({ letter, bg, fg, Icon }, i) => (
        <motion.div
          key={letter}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...pop, delay: 0.1 + i * 0.06 }}
          className="flex items-center gap-2 rounded-lg px-3"
          style={{ background: bg, color: fg }}
        >
          <Icon className="size-5 fill-current" aria-hidden="true" />
          <span className="font-display text-2xl font-black">{letter}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default function Setup({ game }) {
  const { t } = useLang()
  const { state, actions } = game
  const [demoSecond, setDemoSecond] = useState(5)
  const second = Math.min(demoSecond, state.duration)
  const demoPoints = pointsAt((state.duration - second) * 1000, state.duration * 1000)

  const modes = [
    { id: 'clues', Art: CluesArt },
    { id: 'standard', Art: StandardArt },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.88] font-black text-ink uppercase">{t('setup.title')}</h1>
      <p className="mt-4 max-w-2xl text-xl text-ink-2">{t('setup.subtitle')}</p>

      <h2 className="mt-12 font-display text-3xl font-black text-ink uppercase">{t('setup.modeHeading')}</h2>
      <div role="radiogroup" aria-label={t('setup.modeHeading')} className="mt-4 grid gap-5 md:grid-cols-2">
        {modes.map(({ id, Art }) => {
          const selected = state.mode === id
          return (
            <motion.button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => actions.setMode(id)}
              whileTap={{ scale: 0.98 }}
              animate={{ y: selected ? -4 : 0 }}
              transition={pop}
              className={`relative flex flex-col rounded-3xl p-3 text-left transition-shadow ${
                selected ? 'bg-ink shadow-[0_18px_40px_-16px_rgb(18_20_28/0.55)]' : 'bg-paper ring-2 ring-ink/10 hover:ring-ink/25'
              }`}
            >
              <div className="h-40 rounded-2xl bg-board p-5 led-lattice">
                <Art />
              </div>
              <div className="px-3 pt-5 pb-3">
                <span className={`font-display text-4xl leading-none font-black uppercase ${selected ? 'text-white' : 'text-ink'}`}>
                  {t(`mode.${id}`)}
                </span>
                <p className={`mt-2 text-lg leading-snug ${selected ? 'text-board-text' : 'text-ink-2'}`}>{t(`mode.${id}.desc`)}</p>
                <p className={`mt-3 font-display text-base font-extrabold tracking-[0.14em] uppercase ${selected ? 'text-led' : 'text-ink-2'}`}>
                  {t('setup.questionCount', { n: MODES[id].questions.length })} · {t('setup.maxPoints')}
                </p>
              </div>
              {selected && (
                <motion.span
                  layoutId="mode-check"
                  transition={pop}
                  className="absolute top-6 right-6 grid size-10 place-items-center rounded-full bg-led text-ink"
                >
                  <Check className="size-6" strokeWidth={3} aria-hidden="true" />
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-black text-ink uppercase">{t('setup.timeHeading')}</h2>
          <div role="radiogroup" aria-label={t('setup.timeHeading')} className="mt-4 flex flex-wrap gap-3">
            {TIME_OPTIONS.map((sec) => {
              const selected = state.duration === sec
              return (
                <motion.button
                  key={sec}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={t('common.seconds', { n: sec })}
                  onClick={() => actions.setDuration(sec)}
                  whileTap={{ scale: 0.94 }}
                  className={`flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl bg-board led-lattice ring-4 transition-colors ${
                    selected ? 'ring-led' : 'ring-transparent hover:ring-board-3'
                  }`}
                >
                  <SevenSeg value={sec} className={`h-10 ${selected ? 'text-led' : 'text-board-text/40'}`} />
                  <span className={`font-display text-sm font-extrabold tracking-[0.18em] uppercase ${selected ? 'text-led' : 'text-board-text/60'}`}>
                    {t('common.sec')}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-board p-6 led-lattice">
          <BoardLabel>{t('setup.formulaLabel')}</BoardLabel>
          <p className="mt-2 font-display text-2xl font-extrabold text-white">{t('setup.formula')}</p>
          <label htmlFor="demo-second" className="mt-5 block text-base text-board-text">
            {t('setup.demo', { s: second })}
          </label>
          <input
            id="demo-second"
            type="range"
            min={0}
            max={state.duration}
            value={second}
            onChange={(e) => setDemoSecond(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--color-led)]"
          />
          <div className="mt-4 flex items-center gap-4">
            <ShotClock remainingMs={(state.duration - second) * 1000} totalMs={state.duration * 1000} cells={24} className="h-8 flex-1" label={t('game.timeLeft')} />
            <SevenSeg value={demoPoints} length={4} className="h-12 text-led" label={t('setup.demoPoints', { n: demoPoints })} />
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start gap-4 border-t-2 border-concrete-2 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg text-ink-2">{t('setup.ready', { mode: t(`mode.${state.mode}`), s: state.duration })}</p>
        <Button size="xl" onClick={actions.openRoom}>
          <DoorOpen className="size-8" aria-hidden="true" />
          {t('setup.openRoom')}
        </Button>
      </div>
    </div>
  )
}
