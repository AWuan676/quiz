import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button, Label } from '../components/ui.jsx'
import { Blob, CornerLobe } from '../components/Lobe.jsx'
import TimeTrack from '../components/TimeTrack.jsx'
import { TIME_OPTIONS, MODES } from '../data/quizzes.js'
import { ANSWER_PLATES } from '../lib/kits.js'
import { pointsAt } from '../lib/scoring.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

function CluesArt() {
  return (
    <div className="flex h-full items-center gap-4">
      <div className="flex flex-1 flex-col gap-2">
        {[100, 82, 64, 46].map((w, i) => (
          <motion.span
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${w}%` }}
            transition={{ ...pop, delay: 0.1 + i * 0.08 }}
            className="flex h-6 items-center rounded-full bg-paper pl-2.5 text-xs font-semibold"
          >
            {i + 1}
          </motion.span>
        ))}
      </div>
      <Blob variant={0} color="var(--color-sun)" className="size-20 shrink-0">
        <span className="display text-4xl">?</span>
      </Blob>
    </div>
  )
}

function StandardArt() {
  return (
    <div className="grid h-full grid-cols-2 gap-2">
      {ANSWER_PLATES.map(({ letter, bg, Icon }, i) => (
        <motion.span
          key={letter}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...pop, delay: 0.1 + i * 0.06 }}
          className="flex items-center gap-2 rounded-full px-4"
          style={{ background: bg }}
        >
          <Icon className="size-4 fill-current" aria-hidden="true" />
          <span className="display text-xl">{letter}</span>
        </motion.span>
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
    <>
      <CornerLobe corner="br" color="var(--color-lilac)" className="fixed -right-[10vw] -bottom-[12vw] w-[min(34vw,460px)] max-md:hidden" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pt-6 pb-16 sm:px-10">
        <h1 className="display text-[clamp(2.75rem,6vw,5rem)]">{t('setup.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{t('setup.subtitle')}</p>

        <h2 className="display mt-14 text-2xl">{t('setup.modeHeading')}</h2>
        <div role="radiogroup" aria-label={t('setup.modeHeading')} className="mt-4 grid gap-4 md:grid-cols-2">
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
                transition={pop}
                className={`relative flex flex-col rounded-[2.5rem] p-6 text-left transition-colors ${
                  selected ? 'bg-land' : 'bg-paper ring-2 ring-inset ring-ink/10 hover:ring-ink/30'
                }`}
              >
                <div className="h-28 rounded-[1.75rem] bg-water-2/70 p-4">
                  <Art />
                </div>
                <span className="display mt-6 text-3xl">{t(`mode.${id}`)}</span>
                <p className="mt-2 text-base leading-relaxed text-ink">{t(`mode.${id}.desc`)}</p>
                <p className="mt-4 text-sm font-semibold text-ink-2">
                  {t('setup.questionCount', { n: MODES[id].questions.length })} · {t('setup.maxPoints')}
                </p>
                {selected && (
                  <motion.span layoutId="mode-check" transition={pop} className="absolute top-6 right-6 grid size-10 place-items-center rounded-full bg-ink text-water">
                    <Check className="size-5" strokeWidth={3} aria-hidden="true" />
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="display text-2xl">{t('setup.timeHeading')}</h2>
            <div role="radiogroup" aria-label={t('setup.timeHeading')} className="mt-4 flex flex-wrap gap-2">
              {TIME_OPTIONS.map((sec) => {
                const selected = state.duration === sec
                return (
                  <motion.button
                    key={sec}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => actions.setDuration(sec)}
                    whileTap={{ scale: 0.94 }}
                    className={`h-14 min-w-24 rounded-full px-6 text-lg font-semibold tabular transition-colors ${
                      selected ? 'bg-ink text-water' : 'bg-paper ring-2 ring-inset ring-ink/10 hover:ring-ink/30'
                    }`}
                  >
                    {t('common.seconds', { n: sec })}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-paper p-7 ring-2 ring-inset ring-ink/10">
            <Label>{t('setup.formulaLabel')}</Label>
            <p className="mt-2 text-lg font-semibold">{t('setup.formula')}</p>
            <label htmlFor="demo-second" className="mt-5 block text-sm text-ink-2">
              {t('setup.demo', { s: second })}
            </label>
            <input
              id="demo-second"
              type="range"
              min={0}
              max={state.duration}
              value={second}
              onChange={(e) => setDemoSecond(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-ink)]"
            />
            <div className="mt-4 flex items-center gap-5">
              <TimeTrack remainingMs={(state.duration - second) * 1000} totalMs={state.duration * 1000} className="h-4 flex-1" label={t('game.timeLeft')} />
              <span className="display tabular w-28 text-right text-4xl" aria-label={t('setup.demoPoints', { n: demoPoints })}>
                {demoPoints}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-ink-2">{t('setup.ready', { mode: t(`mode.${state.mode}`), s: state.duration })}</p>
          <Button size="xl" chip onClick={actions.openRoom}>
            {t('setup.openRoom')}
          </Button>
        </div>
      </div>
    </>
  )
}
