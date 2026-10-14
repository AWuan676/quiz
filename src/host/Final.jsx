import { motion } from 'framer-motion'
import { RotateCcw, Settings2 } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import Podium from '../components/Podium.jsx'
import Ticker from '../components/Ticker.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import PitchLines from '../components/PitchLines.jsx'
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
      <Ticker items={[t('final.ticker', { name: winner?.name ?? '' }), t('final.tickerThanks'), t('final.ticker', { name: winner?.name ?? '' })]} />
      <div className="relative flex-1 overflow-hidden pitch-stripes">
        <PitchLines />
        <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-36 sm:px-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={pop}
            className="text-center font-display text-[clamp(3rem,8vw,7rem)] leading-[0.85] font-black text-white uppercase [text-shadow:0_6px_24px_rgb(0_0_0/0.25)]"
          >
            {t('final.title')}
          </motion.h1>

          <div className="mt-8 rounded-[28px] bg-concrete/95 px-4 pt-6 sm:px-8">
            <Podium ranked={ranked} />
          </div>

          {rest.length > 0 && (
            <ol className="mt-6 grid gap-2 sm:grid-cols-2">
              {rest.map((team, i) => (
                <motion.li
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...pop, delay: 2 + i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl bg-board px-4 py-3"
                >
                  <span className="w-8 font-display text-2xl font-black text-board-text tabular">{i + 4}</span>
                  <span className="grid size-9 place-items-center rounded-lg font-display text-lg font-black" style={{ background: team.kit.bg, color: team.kit.fg }}>
                    {team.number}
                  </span>
                  <span className="flex-1 truncate font-display text-xl font-extrabold text-white uppercase">{team.name}</span>
                  <span className="font-display text-2xl font-black text-led">
                    <RollingNumber value={team.score} />
                  </span>
                </motion.li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-concrete/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-4 py-4 sm:px-8">
          <Button variant="light" size="md" onClick={() => actions.backToSetup()}>
            <Settings2 className="size-5" aria-hidden="true" />
            {t('final.newSettings')}
          </Button>
          <Button size="lg" onClick={actions.restart}>
            <RotateCcw className="size-6" aria-hidden="true" />
            {t('final.rematch')}
          </Button>
        </div>
      </div>
    </div>
  )
}
