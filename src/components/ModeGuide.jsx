import { motion } from 'framer-motion'
import { Lightbulb, Keyboard, Users, Timer, MonitorPlay, MousePointerClick } from 'lucide-react'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

const STEPS = {
  clues: [
    { Icon: Lightbulb, key: 'guide.clues.1', color: 'var(--color-sun)' },
    { Icon: Keyboard, key: 'guide.clues.2', color: 'var(--color-pond)' },
    { Icon: Users, key: 'guide.team', color: 'var(--color-lilac)' },
    { Icon: Timer, key: 'guide.clues.4', color: 'var(--color-land)' },
  ],
  standard: [
    { Icon: MonitorPlay, key: 'guide.standard.1', color: 'var(--color-sun)' },
    { Icon: MousePointerClick, key: 'guide.standard.2', color: 'var(--color-coral)' },
    { Icon: Users, key: 'guide.team', color: 'var(--color-lilac)' },
    { Icon: Timer, key: 'guide.standard.4', color: 'var(--color-land)' },
  ],
}

/** How to play, for the mode the host picked. Shown in both waiting rooms. */
export default function ModeGuide({ mode, duration, compact = false }) {
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
            <span className="grid size-11 shrink-0 place-items-center rounded-full" style={{ background: color }}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <p className={`pt-1 leading-snug ${compact ? 'text-sm' : 'text-base'}`}>{t(key, { s: duration })}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
