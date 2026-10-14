import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { Jersey } from './ui.jsx'
import RollingNumber from './RollingNumber.jsx'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

// Visual order 2nd · 1st · 3rd; reveal order 3rd → 2nd → 1st.
const SLOTS = [
  { rank: 2, height: '62%', delay: 0.7 },
  { rank: 1, height: '86%', delay: 1.3 },
  { rank: 3, height: '44%', delay: 0.2 },
]

export default function Podium({ ranked, compact = false }) {
  const { t } = useLang()
  return (
    <div className={`grid grid-cols-3 items-end gap-3 sm:gap-5 ${compact ? 'h-[340px]' : 'h-[clamp(320px,52vh,560px)]'}`}>
      {SLOTS.map(({ rank, height, delay }) => {
        const team = ranked[rank - 1]
        if (!team) return <div key={rank} />
        return (
          <div key={rank} className="flex h-full flex-col items-center justify-end">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...pop, delay: delay + 0.35 }}
              className="mb-2 flex flex-col items-center text-center"
            >
              {rank === 1 && <Crown className="size-9 text-led drop-shadow-[0_2px_6px_rgb(179_126_0/0.6)]" aria-hidden="true" />}
              <Jersey kit={team.kit} number={team.number} className={compact ? 'size-14' : 'size-[clamp(3.5rem,7vw,6rem)]'} />
              <span className={`mt-1 line-clamp-2 max-w-full font-display leading-none font-black text-ink uppercase ${compact ? 'text-xl' : 'text-[clamp(1.25rem,2.4vw,2.25rem)]'}`}>
                {team.name}
              </span>
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ type: 'spring', stiffness: 160, damping: 16, delay }}
              className="relative flex w-full flex-col items-center overflow-hidden rounded-t-2xl pt-3"
              style={{ background: team.kit.bg, color: team.kit.fg }}
            >
              <span className={`font-display leading-none font-black ${compact ? 'text-5xl' : 'text-[clamp(3rem,7vw,7rem)]'}`}>{rank}</span>
              <span className="mt-2 rounded-lg bg-board px-3 py-1 font-display text-[clamp(1.1rem,2vw,1.75rem)] font-black text-led">
                <RollingNumber value={team.score} duration={1.6} />
                <span className="sr-only"> {t('common.points')}</span>
              </span>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
