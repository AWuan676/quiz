import { motion } from 'framer-motion'
import { Keyboard, MessagesSquare, MonitorPlay, MousePointerClick, Shuffle, SkipForward, Timer, Users } from 'lucide-react'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

const STEPS = {
  clues: [
    { Icon: MonitorPlay, key: 'guide.clues.screen', color: 'var(--color-sun)' },
    { Icon: Shuffle, key: 'guide.clues.deal', color: 'var(--color-lilac)' },
    { Icon: MessagesSquare, key: 'guide.clues.talk', color: 'var(--color-pond)' },
    { Icon: Keyboard, key: 'guide.clues.type', color: 'var(--color-coral)' },
    { Icon: Users, key: 'guide.team', color: 'var(--color-land)' },
    { Icon: Timer, key: 'guide.score', color: 'var(--color-sun)' },
    { Icon: SkipForward, key: 'guide.auto', color: 'var(--color-lilac)' },
  ],
  standard: [
    { Icon: MonitorPlay, key: 'guide.standard.screen', color: 'var(--color-sun)' },
    { Icon: MousePointerClick, key: 'guide.standard.tap', color: 'var(--color-coral)' },
    { Icon: MessagesSquare, key: 'guide.standard.talk', color: 'var(--color-pond)' },
    { Icon: Users, key: 'guide.team', color: 'var(--color-land)' },
    { Icon: Timer, key: 'guide.score', color: 'var(--color-sun)' },
    { Icon: SkipForward, key: 'guide.auto', color: 'var(--color-lilac)' },
  ],
}

/** How to play, step by step, for the mode the host picked. Shown in both waiting rooms. */
export default function ModeGuide({ mode, duration, multiTry = false, compact = false }) {
  const { t } = useLang()
  return (
    <section aria-labelledby="guide-heading">
      <h2 id="guide-heading" className={`display ${compact ? 'text-xl' : 'text-2xl'}`}>
        {t('guide.title', { mode: t(`mode.${mode}`) })}
      </h2>
      <ol className={`mt-4 grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
        {STEPS[mode].map(({ Icon, key, color }, i) => (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...pop, delay: 0.05 * i }}
            className="flex items-start gap-3"
          >
            <span className="relative grid size-11 shrink-0 place-items-center rounded-full" style={{ background: color }}>
              <Icon className="size-5" aria-hidden="true" />
              <span className="absolute -top-1 -left-1 grid size-5 place-items-center rounded-full bg-ink text-[0.65rem] font-semibold text-water">{i + 1}</span>
            </span>
            <p className={`pt-1 leading-snug ${compact ? 'text-sm' : 'text-base'}`}>
              {t(key === 'guide.team' && multiTry ? 'guide.teamMulti' : key, { s: duration })}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
