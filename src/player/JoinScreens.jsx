import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, DoorClosed, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Button, Label } from '../components/ui.jsx'
import CodeInput from '../components/CodeInput.jsx'
import Avatar from '../components/Avatar.jsx'
import { CornerLobe } from '../components/Lobe.jsx'
import { KITS } from '../lib/kits.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

export function ErrorLine({ code }) {
  const { t } = useLang()
  if (!code) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pop}
      role="alert"
      className="mt-4 flex items-start gap-2 rounded-3xl bg-coral/25 px-4 py-3 text-sm leading-snug font-semibold"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {t(`error.${code}`)}
    </motion.p>
  )
}

export function JoinScreen({ game }) {
  const { t } = useLang()
  const busy = game.busy || !game.uid
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        game.findRoom()
      }}
      className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-6 pb-6"
    >
      <h1 className="display text-[clamp(2.75rem,13vw,4rem)]">{t('join.title')}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-2">{game.code.length === 6 ? t('join.prefilled') : t('join.body')}</p>

      <div className="mt-8">
        <Label>{t('join.codeLabel')}</Label>
        <div className="mt-2">
          <CodeInput value={game.code} onChange={game.setCode} label={t('join.codeLabel')} autoFocus={game.code.length !== 6} invalid={game.error === 'notFound'} />
        </div>
      </div>
      <ErrorLine code={game.error} />

      <div className="mt-auto pt-8">
        <Button type="submit" size="xl" chip={!busy} className="w-full" disabled={game.code.length !== 6 || busy}>
          {busy && <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />}
          {game.busy ? t('join.checking') : t('join.cta')}
        </Button>
      </div>
    </form>
  )
}

/** Name + colour, then straight into the waiting room. */
export function ProfileScreen({ game }) {
  const { t } = useLang()
  const [name, setName] = useState(game.profile.name || '')
  const [avatar, setAvatar] = useState(game.profile.avatar ?? Math.floor(Math.random() * KITS.length))
  const meta = game.room?.meta
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        game.join({ name, avatar })
      }}
      className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-6 pb-6"
    >
      {meta && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={pop} className="self-start rounded-full bg-land px-4 py-1.5 text-sm font-semibold">
          {meta.title} · {t(`mode.${meta.mode}`)}
        </motion.p>
      )}
      <h1 className="display mt-5 text-[clamp(2.75rem,13vw,4rem)]">{t('profile.title')}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-2">{t('profile.body')}</p>

      <div className="mt-8 flex items-center gap-4">
        <motion.div key={avatar} initial={{ scale: 0.7, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={pop}>
          <Avatar name={name || '?'} avatar={avatar} className="size-24" textClass="text-3xl" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <label htmlFor="player-name">
            <Label>{t('profile.name')}</Label>
          </label>
          <input
            id="player-name"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder={t('profile.placeholder')}
            autoFocus
            autoComplete="nickname"
            enterKeyHint="go"
            aria-invalid={['empty', 'taken'].includes(game.error) || undefined}
            className="display mt-2 h-14 w-full rounded-full bg-paper px-5 text-xl ring-2 ring-inset ring-ink/15 outline-none placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:tracking-normal placeholder:text-ink-2/80 focus:ring-ink"
          />
        </div>
      </div>

      <fieldset className="mt-6">
        <legend>
          <Label>{t('profile.color')}</Label>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {KITS.map((k, i) => (
            <label key={k.id} className="cursor-pointer">
              <input type="radio" name="avatar" value={i} checked={avatar === i} onChange={() => setAvatar(i)} className="peer sr-only" />
              <span
                className="grid size-11 place-items-center rounded-full ring-offset-2 ring-offset-water peer-checked:ring-[3px] peer-checked:ring-ink peer-focus-visible:outline-3 peer-focus-visible:outline-pond"
                style={{ background: k.bg }}
              >
                {avatar === i && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
              </span>
              <span className="sr-only">{k.id}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <ErrorLine code={game.error} />

      <div className="mt-auto pt-8">
        <Button type="submit" size="xl" chip={!game.busy} className="w-full" disabled={game.busy || !name.trim()}>
          {game.busy && <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />}
          {t('profile.cta')}
        </Button>
      </div>
    </form>
  )
}

export function ClosedScreen({ onLeave }) {
  const { t } = useLang()
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 text-center">
      <CornerLobe corner="br" color="var(--color-lilac)" className="fixed -right-[30vw] -bottom-[30vw] w-[90vw]" />
      <DoorClosed className="relative size-16" aria-hidden="true" />
      <h1 className="display relative mt-4 text-4xl">{t('closed.title')}</h1>
      <p className="relative mt-3 text-base text-ink-2">{t('closed.body')}</p>
      <Button size="lg" chip className="relative mt-8" onClick={onLeave}>
        {t('closed.cta')}
      </Button>
    </div>
  )
}
