import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, ExternalLink, Play, Settings2, X, Users } from 'lucide-react'
import { Button, BoardLabel, Jersey } from '../components/ui.jsx'
import SevenSeg from '../components/SevenSeg.jsx'
import Ticker from '../components/Ticker.jsx'
import { joinUrl } from '../lib/router.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

export default function Lobby({ game }) {
  const { t } = useLang()
  const { state, actions, total } = game
  const url = joinUrl(state.roomCode)
  const [copied, setCopied] = useState(false)
  const count = state.teams.length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked: the URL is printed on screen anyway */
    }
  }

  const tickerItems = count
    ? [t('lobby.tickerCount', { n: count }), t('lobby.tickerScan'), t('lobby.tickerCode', { code: state.roomCode })]
    : [t('lobby.tickerWaiting'), t('lobby.tickerScan'), t('lobby.tickerCode', { code: state.roomCode })]

  return (
    <div className="flex flex-1 flex-col">
      <Ticker items={tickerItems} />

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[1fr_auto]">
        {/* Room code on the board */}
        <motion.section
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={pop}
          aria-labelledby="room-code-label"
          className="flex flex-col justify-between rounded-[28px] bg-board p-6 led-lattice sm:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BoardLabel className="text-lg">
              <span id="room-code-label">{t('lobby.codeLabel')}</span>
            </BoardLabel>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-board-2 px-4 py-1.5 font-display text-base font-extrabold tracking-wide text-white uppercase">{t(`mode.${state.mode}`)}</span>
              <span className="rounded-full bg-board-2 px-4 py-1.5 font-display text-base font-extrabold tracking-wide text-white uppercase">
                {t('common.seconds', { n: state.duration })} · {t('setup.questionCount', { n: total })}
              </span>
            </div>
          </div>
          <div className="my-8 flex justify-center">
            <SevenSeg value={state.roomCode} className="h-[clamp(6rem,15vw,15rem)] text-led" label={state.roomCode.split('').join(' ')} />
          </div>
          <p className="text-[clamp(1.25rem,2vw,2rem)] leading-tight text-board-text">
            {t('lobby.goTo')} <span className="font-bold break-all text-white">{url.replace(/^https?:\/\//, '').replace(/\/\d+$/, '')}</span>{' '}
            {t('lobby.andEnter')}
          </p>
        </motion.section>

        {/* Gate ticket with the QR */}
        <motion.aside
          initial={{ opacity: 0, rotate: 6, y: 40 }}
          animate={{ opacity: 1, rotate: -1.5, y: 0 }}
          transition={{ ...pop, delay: 0.15 }}
          className="ticket flex flex-col items-center self-start bg-paper px-8 py-7 shadow-[0_24px_48px_-20px_rgb(18_20_28/0.45)] lg:w-[380px]"
        >
          <span className="font-display text-2xl font-black tracking-[0.12em] text-ink uppercase">{t('lobby.ticket')}</span>
          <span className="font-display text-base font-extrabold tracking-[0.2em] text-ink-2 uppercase">
            {t('lobby.gate')} · #{state.roomCode}
          </span>
          <div className="my-5 w-full border-t-2 border-dashed border-concrete-2" />
          <div className="rounded-2xl bg-paper p-2">
            <QRCodeSVG value={url} size={280} level="M" fgColor="#12141C" bgColor="#FFFFFF" title={t('lobby.qrTitle')} className="h-auto w-full max-w-[280px]" />
          </div>
          <p className="mt-4 text-center text-lg leading-snug font-semibold text-ink">{t('lobby.scan')}</p>
          <div className="mt-5 flex w-full gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-concrete font-display text-base font-extrabold tracking-wide text-ink uppercase transition-colors hover:bg-concrete-2"
            >
              {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              {copied ? t('lobby.copied') : t('lobby.copy')}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-concrete font-display text-base font-extrabold tracking-wide text-ink uppercase transition-colors hover:bg-concrete-2"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              {t('lobby.openPlayer')}
            </a>
          </div>
        </motion.aside>
      </div>

      {/* Teams walking on */}
      <section aria-labelledby="teams-heading" className="mx-auto w-full max-w-[1600px] px-4 pb-32 sm:px-8">
        <div className="flex items-center gap-3">
          <Users className="size-7 text-ink" aria-hidden="true" />
          <h2 id="teams-heading" className="font-display text-3xl font-black text-ink uppercase">
            {t('lobby.teamsHeading')}
          </h2>
          <span className="rounded-lg bg-board px-2.5 py-1">
            <SevenSeg value={count} length={2} className="h-7 text-led" />
          </span>
        </div>

        <ul className="mt-5 flex flex-wrap gap-4">
          <AnimatePresence>
            {state.teams.map((team) => (
              <motion.li
                key={team.id}
                layout
                initial={{ opacity: 0, scale: 0.3, y: 60, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={pop}
                className="group relative flex items-center gap-3 rounded-2xl py-3 pr-6 pl-3 shadow-[0_10px_24px_-12px_rgb(18_20_28/0.5)]"
                style={{ background: team.kit.bg, color: team.kit.fg }}
              >
                <span className="rounded-xl bg-white/90 p-1">
                  <Jersey kit={team.kit} number={team.number} className="size-14" />
                </span>
                <span className="max-w-[16ch] font-display text-[clamp(1.5rem,2.2vw,2.25rem)] leading-none font-black uppercase">{team.name}</span>
                <button
                  type="button"
                  onClick={() => actions.kick(team.id)}
                  aria-label={t('lobby.kick', { name: team.name })}
                  className="absolute -top-2 -right-2 grid size-8 place-items-center rounded-full bg-board text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {count === 0 &&
            [0, 1, 2].map((i) => (
              <motion.li
                key={`slot-${i}`}
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
                className="flex h-[84px] w-64 items-center justify-center rounded-2xl border-[3px] border-dashed border-ink/20 px-4 text-center font-display text-lg font-extrabold tracking-wide text-ink-2 uppercase"
              >
                {i === 0 ? t('lobby.empty') : ''}
              </motion.li>
            ))}
        </ul>
      </section>

      {/* Action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-concrete/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Button variant="light" size="md" onClick={actions.backToSetup}>
            <Settings2 className="size-5" aria-hidden="true" />
            <span className="hidden sm:inline">{t('lobby.changeSettings')}</span>
          </Button>
          <div className="flex items-center gap-4">
            <span className="hidden text-lg text-ink-2 md:inline">{count ? t('lobby.readyCount', { n: count }) : t('lobby.needTeam')}</span>
            <Button size="xl" onClick={actions.start} disabled={count === 0}>
              <Play className="size-7 fill-current" aria-hidden="true" />
              {t('lobby.start')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
