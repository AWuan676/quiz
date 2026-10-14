import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, ExternalLink, Settings2, X } from 'lucide-react'
import { Button, Label, TeamBlob } from '../components/ui.jsx'
import { Blob } from '../components/Lobe.jsx'
import { joinUrl } from '../lib/router.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

export default function Lobby({ game }) {
  const { t } = useLang()
  const { state, actions, total } = game
  const url = joinUrl(state.roomCode)
  const [copied, setCopied] = useState(false)
  const count = state.teams.length
  const code = state.roomCode

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked: the URL is printed on screen anyway */
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 px-5 pt-4 sm:px-10 lg:grid-cols-[1fr_auto]">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={pop} aria-labelledby="room-code-label">
          <Label>
            <span id="room-code-label">{t('lobby.codeLabel')}</span>
          </Label>
          <p className="display tabular mt-2 text-[clamp(5rem,13vw,12rem)] tracking-[-0.02em]" aria-label={code.split('').join(' ')}>
            {code.slice(0, 3)}
            <span className="inline-block w-[0.18em]" />
            {code.slice(3)}
          </p>
          <p className="mt-6 max-w-2xl text-[clamp(1.1rem,1.8vw,1.6rem)] leading-snug">
            {t('lobby.goTo')} <span className="font-semibold break-all">{url.replace(/^https?:\/\//, '').replace(/\/\d+$/, '')}</span> {t('lobby.andEnter')}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-sun px-4 py-1.5 text-sm font-semibold">{t(`mode.${state.mode}`)}</span>
            <span className="rounded-full bg-lilac px-4 py-1.5 text-sm font-semibold">
              {t('common.seconds', { n: state.duration })} · {t('setup.questionCount', { n: total })}
            </span>
          </div>
        </motion.section>

        {/* The QR sits in an opening of a green land area */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...pop, delay: 0.1 }}
          className="relative grid size-[min(88vw,440px)] place-items-center justify-self-center"
        >
          <Blob variant={1} color="var(--color-land)" className="absolute inset-0" />
          <div className="relative flex flex-col items-center rounded-[2.25rem] bg-water p-5">
            <QRCodeSVG value={url} size={220} level="M" fgColor="#2C2E2A" bgColor="#F5F1E4" title={t('lobby.qrTitle')} className="h-auto w-[min(52vw,220px)]" />
            <p className="mt-3 max-w-[220px] text-center text-sm leading-snug font-semibold">{t('lobby.scan')}</p>
          </div>
          <div className="absolute -bottom-2 flex gap-2">
            <button type="button" onClick={copy} className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-water uppercase">
              {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              {copied ? t('lobby.copied') : t('lobby.copy')}
            </button>
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-sun px-4 text-sm font-semibold uppercase">
              <ExternalLink className="size-4" aria-hidden="true" />
              {t('lobby.openPlayer')}
            </a>
          </div>
        </motion.aside>
      </div>

      <section aria-labelledby="teams-heading" className="mx-auto mt-10 w-full max-w-[1500px] px-5 pb-36 sm:px-10">
        <h2 id="teams-heading" className="display text-2xl">
          {t('lobby.teamsHeading')} <span className="tabular text-ink-2">({count})</span>
        </h2>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-6">
          <AnimatePresence>
            {state.teams.map((team) => (
              <motion.li
                key={team.id}
                layout
                initial={{ opacity: 0, scale: 0.3, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={pop}
                className="group relative flex items-center gap-3"
              >
                <TeamBlob kit={team.kit} number={team.number} className="size-16" textClass="text-2xl" />
                <span className="display max-w-[14ch] text-[clamp(1.25rem,1.8vw,1.75rem)]">{team.name}</span>
                <button
                  type="button"
                  onClick={() => actions.kick(team.id)}
                  aria-label={t('lobby.kick', { name: team.name })}
                  className="grid size-8 place-items-center rounded-full bg-ink text-water opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {count === 0 && (
            <li className="flex items-center gap-3 text-lg text-ink-2">
              <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
                <Blob variant={3} color="var(--color-water-2)" className="size-16" />
              </motion.span>
              {t('lobby.empty')}
            </li>
          )}
        </ul>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink/10 bg-water">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-10">
          <Button variant="outline" size="md" onClick={actions.backToSetup}>
            <Settings2 className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('lobby.changeSettings')}</span>
          </Button>
          <div className="flex items-center gap-5">
            <span className="hidden text-base text-ink-2 md:inline">{count ? t('lobby.readyCount', { n: count }) : t('lobby.needTeam')}</span>
            <Button size="xl" chip onClick={actions.start} disabled={count === 0}>
              {t('lobby.start')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
