import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, DoorClosed, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Button, BoardLabel } from '../components/ui.jsx'
import CodeInput from '../components/CodeInput.jsx'
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
      className="mt-4 flex items-start gap-2 rounded-xl bg-led-hot/15 px-4 py-3 text-base leading-snug font-semibold text-[#B3200C]"
    >
      <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
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
      className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-8 pb-6"
    >
      <h1 className="font-display text-[clamp(3rem,15vw,4.5rem)] leading-[0.88] font-black text-ink uppercase">{t('join.title')}</h1>
      <p className="mt-3 text-lg leading-snug text-ink-2">{game.code.length === 6 ? t('join.prefilled') : t('join.body')}</p>

      <div className="mt-8 rounded-3xl bg-board p-4 led-lattice">
        <BoardLabel>{t('join.codeLabel')}</BoardLabel>
        <div className="mt-3">
          <CodeInput value={game.code} onChange={game.setCode} label={t('join.codeLabel')} autoFocus={game.code.length !== 6} invalid={game.error === 'notFound'} />
        </div>
      </div>
      <ErrorLine code={game.error} />

      <div className="mt-auto pt-8">
        <Button type="submit" size="xl" className="w-full" disabled={game.code.length !== 6 || checking}>
          {checking ? <LoaderCircle className="size-7 animate-spin" aria-hidden="true" /> : null}
          {checking ? t('join.checking') : t('join.cta')}
          {!checking && <ArrowRight className="size-7" aria-hidden="true" />}
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
      className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-8 pb-6"
    >
      {room && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={pop}
          className="self-start rounded-full bg-pitch px-4 py-1.5 font-display text-base font-extrabold tracking-wide text-white uppercase"
        >
          {t('team.roomFound', { code: room.roomCode })} · {t(`mode.${room.mode}`)} · {t('common.seconds', { n: room.duration })}
        </motion.p>
      )}
      <h1 className="mt-5 font-display text-[clamp(3rem,15vw,4.5rem)] leading-[0.88] font-black text-ink uppercase">{t('team.title')}</h1>
      <p className="mt-3 text-lg leading-snug text-ink-2">{t('team.body')}</p>

      <label htmlFor="team-name" className="mt-8 font-display text-lg font-extrabold tracking-[0.14em] text-ink uppercase">
        {t('team.label')}
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
        className="mt-2 h-16 rounded-2xl bg-paper px-5 font-display text-3xl font-black text-ink uppercase ring-2 ring-ink/10 outline-none placeholder:font-sans placeholder:text-xl placeholder:font-semibold placeholder:text-ink-2/70 placeholder:normal-case focus:ring-4 focus:ring-led"
      />
      <p className="mt-2 text-right text-sm text-ink-2 tabular">{name.length}/24</p>
      <ErrorLine code={game.error} />

      <div className="mt-auto pt-8">
        <Button type="submit" variant="pitch" size="xl" className="w-full" disabled={joining || !name.trim()}>
          {joining && <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />}
          {joining ? t('team.joining') : t('team.cta')}
          {!joining && <ArrowRight className="size-7" aria-hidden="true" />}
        </Button>
      </div>
    </form>
  )
}

export function ClosedScreen({ onLeave }) {
  const { t } = useLang()
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 text-center">
      <DoorClosed className="size-20 text-ink-2" aria-hidden="true" />
      <h1 className="mt-4 font-display text-5xl font-black text-ink uppercase">{t('closed.title')}</h1>
      <p className="mt-3 text-lg text-ink-2">{t('closed.body')}</p>
      <Button size="lg" className="mt-8" onClick={onLeave}>
        {t('closed.cta')}
      </Button>
    </div>
  )
}
