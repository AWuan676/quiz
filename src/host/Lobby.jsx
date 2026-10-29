import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, ExternalLink, X } from 'lucide-react'
import { Button, Label } from '../components/ui.jsx'
import { Blob } from '../components/Lobe.jsx'
import Avatar from '../components/Avatar.jsx'
import ModeGuide from '../components/ModeGuide.jsx'
import { joinUrl } from '../lib/router.js'
import { groupPlayers } from '../lib/room.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

export default function Lobby({ game }) {
  const { t } = useLang()
  const { code, room, meta, actions } = game
  const url = joinUrl(code)
  const [copied, setCopied] = useState(false)
  const groups = groupPlayers(room.players)
  const playerCount = Object.keys(room.players || {}).length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* the URL is printed on screen anyway */
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 px-5 pt-2 sm:px-10 lg:grid-cols-[1fr_auto]">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={pop} aria-labelledby="room-code-label">
          <Label>
            <span id="room-code-label">{t('lobby.codeLabel')}</span>
          </Label>
          <p className="display tabular mt-2 text-[clamp(5rem,12vw,11rem)] tracking-[-0.02em]" aria-label={code.split('').join(' ')}>
            {code.slice(0, 3)}
            <span className="inline-block w-[0.18em]" />
            {code.slice(3)}
          </p>
          <p className="mt-5 max-w-2xl text-[clamp(1.1rem,1.8vw,1.5rem)] leading-snug">
            {t('lobby.goTo')} <span className="font-semibold break-all">{url.replace(/^https?:\/\//, '').replace(/\/\d+$/, '')}</span> {t('lobby.andEnter')}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-sun px-4 py-1.5 text-sm font-semibold">{t(`mode.${meta.mode}`)}</span>
            <span className="rounded-full bg-lilac px-4 py-1.5 text-sm font-semibold">
              {t('common.seconds', { n: meta.duration })} · {t('setup.questionCount', { n: meta.total })}
            </span>
            <span className="rounded-full bg-water-2 px-4 py-1.5 text-sm font-semibold">
              {meta.maxTeam === 1 ? t('room.solo') : t('room.teamHint', { n: meta.maxTeam })}
            </span>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...pop, delay: 0.1 }}
          className="relative grid size-[min(88vw,420px)] place-items-center justify-self-center"
        >
          <Blob variant={1} color="var(--color-land)" className="absolute inset-0" />
          <div className="relative flex flex-col items-center rounded-[2.25rem] bg-water p-5">
            <QRCodeSVG value={url} size={210} level="M" fgColor="#2C2E2A" bgColor="#F5F1E4" title={t('lobby.qrTitle')} className="h-auto w-[min(50vw,210px)]" />
            <p className="mt-3 max-w-[210px] text-center text-sm leading-snug font-semibold">{t('lobby.scan')}</p>
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

      <div className="mx-auto mt-12 grid w-full max-w-[1500px] gap-12 px-5 pb-36 sm:px-10 lg:grid-cols-[1fr_380px]">
        <section aria-labelledby="teams-heading">
          <h2 id="teams-heading" className="display text-2xl">
            {t('lobby.teamsHeading')}{' '}
            <span className="tabular text-ink-2">
              ({groups.length} · {t('lobby.playersN', { n: playerCount })})
            </span>
          </h2>
          <ul className="mt-6 flex flex-wrap gap-4">
            <AnimatePresence>
              {groups.map((g) => (
                <motion.li
                  key={g.teamId}
                  layout
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={pop}
                  className={`flex flex-wrap items-center gap-3 rounded-full py-2 pr-5 pl-2 ${g.members.length > 1 ? 'bg-paper ring-2 ring-inset ring-ink/10' : ''}`}
                >
                  {g.members.map((m) => (
                    <span key={m.uid} className="group relative flex items-center gap-2">
                      <Avatar name={m.name} avatar={m.avatar} className="size-14" dim={m.online === false} />
                      <span className="max-w-[12ch] truncate text-lg font-semibold">{m.name}</span>
                      <button
                        type="button"
                        onClick={() => actions.kick(m.uid)}
                        aria-label={t('lobby.kick', { name: m.name })}
                        className="grid size-7 place-items-center rounded-full bg-ink text-water opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <X className="size-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </motion.li>
              ))}
            </AnimatePresence>
            {groups.length === 0 && (
              <li className="flex items-center gap-3 text-lg text-ink-2">
                <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
                  <Blob variant={3} color="var(--color-water-2)" className="size-16" />
                </motion.span>
                {t('lobby.empty')}
              </li>
            )}
          </ul>
        </section>
        <aside className="rounded-[2.5rem] bg-paper p-6 ring-2 ring-inset ring-ink/10">
          <ModeGuide mode={meta.mode} duration={meta.duration} compact />
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink/10 bg-water">
        <div className="mx-auto flex max-w-[1500px] items-center justify-end gap-5 px-5 py-4 sm:px-10">
          <span className="hidden text-base text-ink-2 md:inline">{playerCount ? t('lobby.readyCount', { n: groups.length }) : t('lobby.needTeam')}</span>
          <Button size="xl" chip onClick={actions.start} disabled={playerCount === 0}>
            {t('lobby.start')}
          </Button>
        </div>
      </div>
    </div>
  )
}
