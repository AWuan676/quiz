import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, LoaderCircle, Hourglass } from 'lucide-react'
import { Button, Label, TeamBlob } from '../components/ui.jsx'
import TimeTrack from '../components/TimeTrack.jsx'
import Podium from '../components/Podium.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import { CornerLobe } from '../components/Lobe.jsx'
import { ANSWER_PLATES } from '../lib/kits.js'
import { pointsAt, rankTeams } from '../lib/scoring.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

function Dots() {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="size-1.5 rounded-full bg-current" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </span>
  )
}

export function WaitingScreen({ game }) {
  const { t } = useLang()
  const { me, room } = game
  const settingUp = room?.phase === 'setup'
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10 text-center">
      <CornerLobe corner="tr" className="absolute -top-[20vw] -right-[35vw] w-[95vw] sm:w-[60vw]" />
      <CornerLobe corner="bl" color="var(--color-pond)" delay={0.1} className="absolute -bottom-[25vw] -left-[30vw] w-[70vw] sm:w-[36vw]" />
      <div className="relative flex flex-col items-center">
        {me && (
          <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={pop}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
              <TeamBlob kit={me.kit} number={me.number} className="size-40" textClass="text-6xl" />
            </motion.div>
          </motion.div>
        )}
        <h1 className="display mt-5 text-[clamp(2.25rem,11vw,3.5rem)]">{me?.name}</h1>
        <p className="mt-6 inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-base font-semibold text-water">
          {settingUp ? t('wait.settingUp') : t('wait.title')}
          <Dots />
        </p>
        {room && (
          <p className="mt-4 text-sm font-semibold text-ink-2">
            {t('wait.teams', { n: room.teams.length })} · {t(`mode.${room.mode}`)}
          </p>
        )}
      </div>
    </div>
  )
}

function Measures({ room, remainingMs }) {
  const { t } = useLang()
  const totalMs = room.duration * 1000
  const pts = pointsAt(remainingMs, totalMs)
  return (
    <div className="px-4 pt-1 pb-3">
      <div className="grid grid-cols-3 items-end">
        <div>
          <Label>{t('game.question')}</Label>
          <p className="display tabular text-2xl">
            {room.qIndex + 1}
            <span className="text-ink-2">/{room.total}</span>
          </p>
        </div>
        <div className="text-center">
          <Label>{t('game.livePoints')}</Label>
          <p className="display tabular text-2xl" aria-label={t('game.livePointsAria', { n: pts })}>
            {pts}
          </p>
        </div>
        <div className="text-right">
          <Label>{t('game.timeLeft')}</Label>
          <p className={`display tabular text-2xl ${remainingMs / totalMs < 0.2 ? 'text-alert' : ''}`}>{Math.ceil(remainingMs / 1000)}s</p>
        </div>
      </div>
      <TimeTrack remainingMs={remainingMs} totalMs={totalMs} className="mt-3 h-3" label={t('game.timeLeft')} />
    </div>
  )
}

export function ControllerScreen({ game, remainingMs }) {
  const { room } = game
  return (
    <div className="flex flex-1 flex-col">
      <Measures room={room} remainingMs={remainingMs} />
      {room.mode === 'standard' ? <StandardPad game={game} /> : <CluesPad game={game} />}
    </div>
  )
}

function StandardPad({ game }) {
  const { tr } = useLang()
  const options = game.room.question?.options ?? []
  return (
    <div className="mx-auto grid w-full max-w-xl flex-1 grid-cols-2 gap-3 p-3">
      {ANSWER_PLATES.map(({ letter, bg, fg, Icon }, i) => (
        <motion.button
          key={letter}
          type="button"
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileTap={{ scale: 0.92 }}
          transition={{ ...pop, delay: i * 0.05 }}
          onClick={() => game.submitAnswer(i)}
          className="flex min-h-36 flex-col items-start justify-between rounded-[2.25rem] p-5 text-left"
          style={{ background: bg, color: fg }}
        >
          <span className="flex w-full items-center justify-between">
            <span className="grid size-11 place-items-center rounded-full bg-water">
              <Icon className="size-5 fill-current" aria-hidden="true" />
            </span>
            <span className="display text-4xl">{letter}</span>
          </span>
          <span className="text-base leading-tight font-semibold">{tr(options[i])}</span>
        </motion.button>
      ))}
    </div>
  )
}

function CluesPad({ game }) {
  const { t, tr } = useLang()
  const [value, setValue] = useState('')
  const q = game.room.question
  const submit = (e) => {
    e.preventDefault()
    if (value.trim()) game.submitAnswer(value.trim())
  }
  return (
    <form onSubmit={submit} className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-4">
      <p className="display text-xl">
        <span className="text-ink-2">{t('game.cluesPrompt')}</span> {tr(q?.category)}
      </p>
      <ol className="mt-4 flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => {
          const hint = q?.hints[i]
          return (
            <li key={i} className="flex items-start gap-3">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${hint ? 'bg-ink text-water' : 'bg-water-2 text-ink-2'}`}>{i + 1}</span>
              <AnimatePresence mode="wait" initial={false}>
                {hint ? (
                  <motion.span key="open" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={pop} className="pt-1 text-base leading-snug font-medium">
                    {tr(hint)}
                  </motion.span>
                ) : (
                  <span key="locked" className="mt-1.5 h-5 w-2/3 rounded-full bg-water-2" aria-label={t('game.hintLocked')} />
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>

      <label htmlFor="clue-answer" className="mt-8">
        <Label>{t('play.yourAnswer')}</Label>
      </label>
      <input
        id="clue-answer"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 60))}
        placeholder={t('play.answerPlaceholder')}
        autoComplete="off"
        autoCapitalize="words"
        enterKeyHint="send"
        className="mt-2 h-16 rounded-full bg-paper px-6 text-xl font-semibold ring-2 ring-inset ring-ink/15 outline-none placeholder:text-base placeholder:font-medium placeholder:text-ink-2/80 focus:ring-ink"
      />
      <p className="mt-2 px-4 text-xs text-ink-2">{t('play.oneShot')}</p>
      <div className="mt-auto pt-6">
        <Button type="submit" size="xl" chip className="w-full" disabled={!value.trim()}>
          {t('play.lockIn')}
        </Button>
      </div>
    </form>
  )
}

export function FeedbackScreen({ game, result }) {
  const { t, tr } = useLang()
  const { room, pending } = game
  const picked = pending?.value
  const pickedLabel =
    room.mode === 'standard' && picked !== undefined && room.question?.options ? `${ANSWER_PLATES[picked].letter} · ${tr(room.question.options[picked])}` : picked

  if (!result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <LoaderCircle className="size-12 animate-spin" aria-hidden="true" />
        <p className="display text-2xl">{t('play.sending')}</p>
      </div>
    )
  }

  if (result.late) return <TimeUpScreen />

  const ok = result.correct
  return (
    <div className={`m-3 flex flex-1 flex-col items-center justify-center rounded-[2.5rem] px-6 py-10 text-center ${ok ? 'bg-land' : 'bg-coral'}`}>
      <motion.span
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...pop, stiffness: 520 }}
        className="grid size-32 place-items-center rounded-full bg-water"
      >
        {ok ? <Check className="size-16" strokeWidth={3.5} aria-hidden="true" /> : <X className="size-16" strokeWidth={3.5} aria-hidden="true" />}
      </motion.span>
      <motion.h1 initial={{ opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...pop, delay: 0.1 }} className="display mt-6 text-[clamp(3rem,15vw,5rem)]">
        {ok ? t('play.correct') : t('play.incorrect')}
      </motion.h1>
      {ok && (
        <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...pop, delay: 0.25 }} className="display tabular mt-4 rounded-full bg-ink px-6 py-3 text-3xl text-water">
          +<RollingNumber value={result.points} duration={0.8} /> <span className="text-lg">{t('common.pts')}</span>
        </motion.p>
      )}
      {pickedLabel !== undefined && pickedLabel !== null && (
        <p className="mt-6 max-w-sm text-base font-medium">
          {t('play.youAnswered')} <span className="font-semibold">“{pickedLabel}”</span>
        </p>
      )}
      <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
        {t('play.waitOthers')} <Dots />
      </p>
    </div>
  )
}

export function TimeUpScreen() {
  const { t } = useLang()
  return (
    <div className="m-3 flex flex-1 flex-col items-center justify-center rounded-[2.5rem] bg-lilac px-6 text-center">
      <motion.span initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={pop}>
        <Hourglass className="size-20" aria-hidden="true" />
      </motion.span>
      <h1 className="display mt-6 text-5xl">{t('play.timeUp')}</h1>
      <p className="mt-3 text-base">{t('play.timeUpBody')}</p>
    </div>
  )
}

function useRank(game) {
  const ranked = rankTeams(game.room?.teams ?? [])
  const index = ranked.findIndex((tm) => tm.id === game.me?.id)
  return { ranked, rank: index + 1, of: ranked.length }
}

export function RevealScreen({ game }) {
  const { t, tr } = useLang()
  const { room, me } = game
  const { rank, of } = useRank(game)
  const answerText =
    room.mode === 'clues'
      ? tr(room.answer?.text)
      : room.answer && room.question?.options
        ? `${ANSWER_PLATES[room.answer.index].letter} · ${tr(room.question.options[room.answer.index])}`
        : ''
  const plate = room.mode === 'standard' && room.answer ? ANSWER_PLATES[room.answer.index] : null
  const gained = me?.lastGain ?? 0

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-6">
      <Label>{t('reveal.correctWas')}</Label>
      <motion.p
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={pop}
        className="display mt-2 self-start rounded-full px-6 py-4 text-3xl"
        style={{ background: plate ? plate.bg : 'var(--color-sun)' }}
      >
        {answerText}
      </motion.p>

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t-2 border-ink pt-6">
        <div>
          <dt>
            <Label>{t('reveal.thisRound')}</Label>
          </dt>
          <dd className="display tabular mt-1 text-4xl">{gained > 0 ? `+${gained}` : '0'}</dd>
        </div>
        <div>
          <dt>
            <Label>{t('reveal.rank')}</Label>
          </dt>
          <dd className="display tabular mt-1 text-4xl">
            {rank > 0 ? rank : '–'}
            <span className="text-xl text-ink-2">/{of}</span>
          </dd>
        </div>
        <div className="col-span-2">
          <dt>
            <Label>{t('reveal.total')}</Label>
          </dt>
          <dd className="display tabular mt-1 text-6xl">
            <RollingNumber value={me?.score ?? 0} />
          </dd>
        </div>
      </dl>
      <p className="mt-auto inline-flex items-center justify-center gap-2 pt-8 text-sm font-semibold text-ink-2">
        {t('reveal.waitNext')} <Dots />
      </p>
    </div>
  )
}

export function FinalScreen({ game }) {
  const { t } = useLang()
  const { me } = game
  const { ranked, rank, of } = useRank(game)
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-6">
      <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={pop} className="text-center">
        <Label>{t('final.yourRank')}</Label>
        <p className="display tabular text-[7rem]">
          {rank > 0 ? rank : '–'}
          <span className="text-4xl text-ink-2">/{of}</span>
        </p>
        <p className="display tabular mt-1 text-2xl text-ink-2">
          <RollingNumber value={me?.score ?? 0} duration={1.6} /> {t('common.pts')}
        </p>
      </motion.div>
      <div className="mt-8">
        <Podium ranked={ranked} compact />
      </div>
      <p className="mt-6 text-center text-sm text-ink-2">{t('final.thanks')}</p>
    </div>
  )
}
