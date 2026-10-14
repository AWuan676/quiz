import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Send, LoaderCircle, Hourglass, Lock } from 'lucide-react'
import { Button, BoardLabel, Jersey } from '../components/ui.jsx'
import SevenSeg from '../components/SevenSeg.jsx'
import ShotClock from '../components/ShotClock.jsx'
import Podium from '../components/Podium.jsx'
import PitchLines from '../components/PitchLines.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import { ANSWER_PLATES } from '../lib/kits.js'
import { pointsAt, rankTeams } from '../lib/scoring.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

function Dots() {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-current"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

export function WaitingScreen({ game }) {
  const { t } = useLang()
  const { me, room } = game
  const settingUp = room?.phase === 'setup'
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10 text-center pitch-stripes">
      <PitchLines />
      <div className="relative flex flex-col items-center">
        {me && (
          <motion.div
            initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={pop}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
              <Jersey kit={me.kit} number={me.number} className="size-44 drop-shadow-[0_18px_20px_rgb(0_0_0/0.3)]" />
            </motion.div>
          </motion.div>
        )}
        <h1 className="mt-4 font-display text-[clamp(2.5rem,12vw,4rem)] leading-[0.9] font-black text-white uppercase [text-shadow:0_4px_16px_rgb(0_0_0/0.25)]">
          {me?.name}
        </h1>
        <p className="mt-6 inline-flex items-center gap-3 rounded-full bg-board px-5 py-3 font-display text-xl font-extrabold tracking-wide text-led uppercase">
          {settingUp ? t('wait.settingUp') : t('wait.title')}
          <Dots />
        </p>
        {room && (
          <p className="mt-4 text-lg font-semibold text-chalk">
            {t('wait.teams', { n: room.teams.length })} · {t(`mode.${room.mode}`)}
          </p>
        )}
      </div>
    </div>
  )
}

function MiniBoard({ room, remainingMs }) {
  const { t } = useLang()
  const totalMs = room.duration * 1000
  const pts = pointsAt(remainingMs, totalMs)
  return (
    <div className="bg-board px-4 pt-3 pb-4">
      <div className="flex items-end justify-between">
        <div>
          <BoardLabel className="text-xs">{t('game.question')}</BoardLabel>
          <div className="mt-1 flex items-center gap-1.5">
            <SevenSeg value={room.qIndex + 1} className="h-8 text-led" />
            <span className="font-display text-2xl font-black text-board-text/50">/</span>
            <SevenSeg value={room.total} className="h-8 text-board-text/70" />
          </div>
        </div>
        <div className="text-center">
          <BoardLabel className="text-xs">{t('game.livePoints')}</BoardLabel>
          <div className="mt-1">
            <SevenSeg value={pts} length={4} className="h-8 text-led" label={t('game.livePointsAria', { n: pts })} />
          </div>
        </div>
        <div className="text-right">
          <BoardLabel className="text-xs">{t('game.timeLeft')}</BoardLabel>
          <div className="mt-1">
            <SevenSeg value={Math.ceil(remainingMs / 1000)} length={2} className={`h-8 ${remainingMs / totalMs < 0.2 ? 'text-led-hot' : 'text-led'}`} />
          </div>
        </div>
      </div>
      <ShotClock remainingMs={remainingMs} totalMs={totalMs} cells={30} className="mt-3 h-5 bg-board-2" label={t('game.timeLeft')} />
    </div>
  )
}

export function ControllerScreen({ game, remainingMs }) {
  const { room } = game
  return (
    <div className="flex flex-1 flex-col">
      <MiniBoard room={room} remainingMs={remainingMs} />
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
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileTap={{ scale: 0.92 }}
          transition={{ ...pop, delay: i * 0.05 }}
          onClick={() => game.submitAnswer(i)}
          className="flex min-h-36 flex-col items-start justify-between rounded-3xl p-4 text-left shadow-[0_8px_0_rgb(0_0_0/0.22)] active:shadow-[0_2px_0_rgb(0_0_0/0.22)]"
          style={{ background: bg, color: fg }}
        >
          <span className="flex w-full items-center justify-between">
            <Icon className="size-10 fill-current" aria-hidden="true" />
            <span className="font-display text-5xl leading-none font-black">{letter}</span>
          </span>
          <span className="text-lg leading-tight font-bold">{tr(options[i])}</span>
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
    <form onSubmit={submit} className="mx-auto flex w-full max-w-xl flex-1 flex-col p-4">
      <p className="font-display text-lg font-extrabold tracking-wide text-ink-2 uppercase">
        {t('game.cluesPrompt')} <span className="text-ink">{tr(q?.category)}</span>
      </p>
      <ol className="mt-3 flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => {
          const hint = q?.hints[i]
          return (
            <li key={i}>
              <AnimatePresence mode="wait" initial={false}>
                {hint ? (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={pop}
                    className="flex items-start gap-3 rounded-xl bg-paper p-3 ring-1 ring-ink/10"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-board font-display text-lg font-black text-led">{i + 1}</span>
                    <span className="text-base leading-snug font-semibold text-ink">{tr(hint)}</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl bg-concrete-2 p-3 text-ink-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-ink/10 font-display text-lg font-black">{i + 1}</span>
                    <Lock className="size-4" aria-hidden="true" />
                    <span className="font-display text-sm font-extrabold tracking-[0.14em] uppercase">{t('game.hintLocked')}</span>
                  </div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>

      <label htmlFor="clue-answer" className="mt-6 font-display text-lg font-extrabold tracking-[0.14em] text-ink uppercase">
        {t('play.yourAnswer')}
      </label>
      <input
        id="clue-answer"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 60))}
        placeholder={t('play.answerPlaceholder')}
        autoComplete="off"
        autoCapitalize="words"
        enterKeyHint="send"
        className="mt-2 h-16 rounded-2xl bg-paper px-5 text-2xl font-bold text-ink ring-2 ring-ink/10 outline-none placeholder:text-lg placeholder:font-semibold placeholder:text-ink-2/70 focus:ring-4 focus:ring-led"
      />
      <p className="mt-2 text-sm text-ink-2">{t('play.oneShot')}</p>
      <div className="mt-auto pt-6">
        <Button type="submit" size="xl" className="w-full" disabled={!value.trim()}>
          <Send className="size-7" aria-hidden="true" />
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
    room.mode === 'standard' && picked !== undefined && room.question?.options
      ? `${ANSWER_PLATES[picked].letter} · ${tr(room.question.options[picked])}`
      : picked

  if (!result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-board px-6 text-center text-led">
        <LoaderCircle className="size-16 animate-spin" aria-hidden="true" />
        <p className="font-display text-3xl font-black uppercase">{t('play.sending')}</p>
      </div>
    )
  }

  if (result.late) return <TimeUpScreen />

  const ok = result.correct
  return (
    <div className={`flex flex-1 flex-col items-center justify-center px-6 py-10 text-center ${ok ? 'bg-kit-green' : 'bg-kit-red'} text-white`}>
      <motion.span
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...pop, stiffness: 520 }}
        className="grid size-36 place-items-center rounded-full bg-white shadow-[0_14px_30px_-10px_rgb(0_0_0/0.4)]"
      >
        {ok ? (
          <Check className="size-20 text-kit-green" strokeWidth={4} aria-hidden="true" />
        ) : (
          <X className="size-20 text-kit-red" strokeWidth={4} aria-hidden="true" />
        )}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 20, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...pop, delay: 0.1 }}
        className="mt-6 font-display text-[clamp(3.5rem,18vw,6rem)] leading-[0.85] font-black uppercase"
      >
        {ok ? t('play.correct') : t('play.incorrect')}
      </motion.h1>
      {ok && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...pop, delay: 0.25 }}
          className="mt-5 rounded-2xl bg-board px-6 py-3 font-display text-4xl font-black text-led"
        >
          +<RollingNumber value={result.points} duration={0.8} /> <span className="text-2xl">{t('common.pts')}</span>
        </motion.p>
      )}
      {pickedLabel !== undefined && pickedLabel !== null && (
        <p className="mt-6 max-w-sm text-lg font-semibold text-white/90">
          {t('play.youAnswered')} <span className="font-bold text-white">“{pickedLabel}”</span>
        </p>
      )}
      <p className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-white/85">
        {t('play.waitOthers')} <Dots />
      </p>
    </div>
  )
}

export function TimeUpScreen() {
  const { t } = useLang()
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-board px-6 text-center">
      <motion.span initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={pop}>
        <Hourglass className="size-24 text-led-hot" aria-hidden="true" />
      </motion.span>
      <h1 className="mt-6 font-display text-6xl font-black text-white uppercase">{t('play.timeUp')}</h1>
      <p className="mt-3 text-lg text-board-text">{t('play.timeUpBody')}</p>
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
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">
      <BoardLabel className="text-ink-2">{t('reveal.correctWas')}</BoardLabel>
      <motion.p
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={pop}
        className="mt-2 rounded-2xl px-5 py-4 font-display text-4xl leading-none font-black uppercase"
        style={plate ? { background: plate.bg, color: plate.fg } : { background: 'var(--color-led)', color: 'var(--color-ink)' }}
      >
        {answerText}
      </motion.p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-board p-4 led-lattice">
          <BoardLabel className="text-xs">{t('reveal.thisRound')}</BoardLabel>
          <p className={`mt-2 font-display text-4xl font-black ${gained > 0 ? 'text-led' : 'text-board-text'}`}>
            {gained > 0 ? `+${gained}` : '0'}
          </p>
        </div>
        <div className="rounded-2xl bg-board p-4 led-lattice">
          <BoardLabel className="text-xs">{t('reveal.rank')}</BoardLabel>
          <p className="mt-2 font-display text-4xl font-black text-white">
            {rank > 0 ? rank : '–'}
            <span className="text-xl text-board-text">/{of}</span>
          </p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl bg-ink p-5">
        <BoardLabel className="text-xs">{t('reveal.total')}</BoardLabel>
        <p className="mt-1 font-display text-6xl font-black text-led">
          <RollingNumber value={me?.score ?? 0} />
        </p>
      </div>
      <p className="mt-auto inline-flex items-center justify-center gap-2 pt-8 text-center text-base font-semibold text-ink-2">
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
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={pop} className="text-center">
        <BoardLabel className="text-ink-2">{t('final.yourRank')}</BoardLabel>
        <p className="font-display text-[7rem] leading-none font-black text-ink">
          {rank > 0 ? rank : '–'}
          <span className="text-4xl text-ink-2">/{of}</span>
        </p>
        <p className="mt-1 font-display text-3xl font-black text-ink-2">
          <RollingNumber value={me?.score ?? 0} duration={1.6} /> {t('common.pts')}
        </p>
      </motion.div>
      <div className="mt-8">
        <Podium ranked={ranked} compact />
      </div>
      <p className="mt-6 text-center text-base text-ink-2">{t('final.thanks')}</p>
    </div>
  )
}
