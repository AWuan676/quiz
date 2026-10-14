import { useState } from 'react'
import { motion } from 'framer-motion'
import { DoorClosed, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Button, Label } from '../components/ui.jsx'
import CodeInput from '../components/CodeInput.jsx'
import { CornerLobe } from '../components/Lobe.jsx'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

function ErrorLine({ code }) {
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
  const checking = game.step === 'checking'
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
        <Button type="submit" size="xl" chip={!checking} className="w-full" disabled={game.code.length !== 6 || checking}>
          {checking && <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />}
          {checking ? t('join.checking') : t('join.cta')}
        </Button>
      </div>
    </form>
  )
}

export function TeamScreen({ game }) {
  const { t } = useLang()
  const [name, setName] = useState(game.teamName || '')
  const joining = game.step === 'joining'
  const room = game.room
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        game.joinTeam(name)
      }}
      className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-6 pb-6"
    >
      {room && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={pop} className="self-start rounded-full bg-land px-4 py-1.5 text-sm font-semibold">
          {t('team.roomFound', { code: room.roomCode })} · {t(`mode.${room.mode}`)} · {t('common.seconds', { n: room.duration })}
        </motion.p>
      )}
      <h1 className="display mt-5 text-[clamp(2.75rem,13vw,4rem)]">{t('team.title')}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-2">{t('team.body')}</p>

      <label htmlFor="team-name" className="mt-8">
        <Label>{t('team.label')}</Label>
      </label>
      <input
        id="team-name"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 24))}
        placeholder={t('team.placeholder')}
        autoFocus
        autoComplete="off"
        enterKeyHint="go"
        aria-invalid={['empty', 'taken'].includes(game.error) || undefined}
        className="display mt-2 h-16 rounded-full bg-paper px-6 text-2xl ring-2 ring-inset ring-ink/15 outline-none placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:tracking-normal placeholder:text-ink-2/80 focus:ring-ink"
      />
      <p className="mt-2 pr-4 text-right text-xs text-ink-2 tabular">{name.length}/24</p>
      <ErrorLine code={game.error} />

      <div className="mt-auto pt-8">
        <Button type="submit" size="xl" chip={!joining} className="w-full" disabled={joining || !name.trim()}>
          {joining && <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />}
          {joining ? t('team.joining') : t('team.cta')}
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
