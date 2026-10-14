import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { TeamBlob } from './ui.jsx'
import RollingNumber from './RollingNumber.jsx'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

// Visual order 2nd · 1st · 3rd; reveal order 3rd → 2nd → 1st.
const SLOTS = [
  { rank: 2, height: '58%', delay: 0.7 },
  { rank: 1, height: '82%', delay: 1.3 },
  { rank: 3, height: '40%', delay: 0.2 },
]

export default function Podium({ ranked, compact = false }) {
  const { t } = useLang()
  return (
    <div className={`grid grid-cols-3 items-end gap-3 sm:gap-6 ${compact ? 'h-[320px]' : 'h-[clamp(320px,52vh,560px)]'}`}>
      {SLOTS.map(({ rank, height, delay }) => {
        const team = ranked[rank - 1]
        if (!team) return <div key={rank} />
        return (
          <div key={rank} className="flex h-full flex-col items-center justify-end">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...pop, delay: delay + 0.35 }}
              className="mb-3 flex flex-col items-center text-center"
            >
              {rank === 1 && <Crown className="mb-1 size-8 text-ink" aria-hidden="true" />}
              <TeamBlob
                kit={team.kit}
                number={team.number}
                className={compact ? 'size-14' : 'size-[clamp(3.5rem,7vw,6rem)]'}
                textClass={compact ? 'text-xl' : 'text-[clamp(1.25rem,2.6vw,2.5rem)]'}
              />
              <span className={`display mt-2 line-clamp-2 max-w-full ${compact ? 'text-lg' : 'text-[clamp(1.1rem,2.2vw,2rem)]'}`}>{team.name}</span>
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ type: 'spring', stiffness: 160, damping: 16, delay }}
              className="flex w-full flex-col items-center overflow-hidden rounded-t-[2.5rem] pt-4"
              style={{ background: team.kit.bg, color: team.kit.fg }}
            >
              <span className={`display ${compact ? 'text-5xl' : 'text-[clamp(3rem,7vw,7rem)]'}`}>{rank}</span>
              <span className="display tabular mt-1 text-[clamp(1rem,1.8vw,1.6rem)]">
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
