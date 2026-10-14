import { motion } from 'framer-motion'
import { RotateCcw, Settings2 } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import Podium from '../components/Podium.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import { CornerLobe } from '../components/Lobe.jsx'
import { rankTeams } from '../lib/scoring.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

export default function Final({ game }) {
  const { t } = useLang()
  const { state, actions } = game
  const ranked = rankTeams(state.teams)
  const rest = ranked.slice(3)
  const winner = ranked[0]

  return (
    <div className="flex flex-1 flex-col">
      <CornerLobe corner="tl" color="var(--color-sun)" className="fixed -top-[8vw] -left-[10vw] w-[min(36vw,480px)] max-md:hidden" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pt-4 pb-36 sm:px-10">
        <motion.h1 initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={pop} className="display text-center text-[clamp(2.75rem,7vw,6rem)]">
          {t('final.title')}
        </motion.h1>
        {winner && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...pop, delay: 1.9 }}
            className="mt-3 text-center text-xl text-ink-2"
          >
            {t('final.ticker', { name: winner.name })}
          </motion.p>
        )}

        <div className="mt-10">
          <Podium ranked={ranked} />
        </div>

        {rest.length > 0 && (
          <ol className="mt-4 border-t-2 border-ink">
            {rest.map((team, i) => (
              <motion.li
                key={team.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...pop, delay: 2 + i * 0.06 }}
                className="flex items-center gap-4 border-b border-ink/10 py-3"
              >
                <span className="w-8 text-base font-semibold tabular text-ink-2">{i + 4}</span>
                <span className="size-4 rounded-full" style={{ background: team.kit.bg }} aria-hidden="true" />
                <span className="flex-1 truncate text-lg font-semibold">{team.name}</span>
                <span className="display text-2xl tabular">
                  <RollingNumber value={team.score} />
                </span>
              </motion.li>
            ))}
          </ol>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink/10 bg-water">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-5 py-4 sm:px-10">
          <Button variant="outline" size="md" onClick={() => actions.backToSetup()}>
            <Settings2 className="size-4" aria-hidden="true" />
            {t('final.newSettings')}
          </Button>
          <Button size="lg" onClick={actions.restart}>
            <RotateCcw className="size-5" aria-hidden="true" />
            {t('final.rematch')}
          </Button>
        </div>
      </div>
    </div>
  )
}
