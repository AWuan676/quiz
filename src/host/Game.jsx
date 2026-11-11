import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Check, Eye, Flag, Pause, Play, X } from 'lucide-react'
import { Button, Label } from '../components/ui.jsx'
import TimeTrack from '../components/TimeTrack.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import { ANSWER_PLATES } from '../lib/kits.js'
import { pointsAt } from '../lib/scoring.js'
import { rankedTeams, useServerNow } from '../lib/room.js'
import { hostDb } from '../lib/firebase.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

/** How long the answer stays up before the next question starts on its own. */
const REVEAL_MS = 5000

function Kbd({ children }) {
  return <kbd className="rounded-md bg-ink/10 px-1.5 py-0.5 font-sans text-xs font-semibold">{children}</kbd>
}

function CluesStage({ question, hintsRevealed, revealed }) {
  const { t, tr } = useLang()
  return (
    <div className="flex flex-1 flex-col">
      <p className="display text-[clamp(1.5rem,2.6vw,2.5rem)]">
        <span className="text-ink-2">{t('game.cluesPrompt')}</span> {tr(question.category)}
      </p>
      <ol className="mt-6 flex flex-col gap-3">
        {question.hints.map((hint, i) => {
          const open = Boolean(revealed)
          return (
            <li key={i} className="flex items-start gap-5">
              <span
                className={`display grid size-14 shrink-0 place-items-center rounded-full text-2xl transition-colors ${open ? 'bg-ink text-water' : 'bg-water-2 text-ink-2'}`}
              >
                {i + 1}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.p
                    key="open"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={pop}
                    className="pt-2 text-[clamp(1.25rem,2.2vw,2.25rem)] leading-snug font-semibold"
                  >
                    {tr(hint)}
                  </motion.p>
                ) : (
                  <motion.p key="locked" exit={{ opacity: 0 }} className="pt-3 text-[clamp(1.1rem,1.8vw,1.6rem)] font-semibold text-ink-2">{t('game.clueOnPhone', { n: i + 1 })}</motion.p>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={pop}
            className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-1 self-start rounded-full bg-sun px-8 py-5"
          >
            <span className="text-sm font-semibold tracking-[0.1em] uppercase">{t('game.answerIs')}</span>
            <span className="display text-[clamp(2.25rem,4.5vw,4rem)]">{tr(revealed.text)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StandardStage({ question, revealed, answers, teams }) {
  const { tr } = useLang()
  const picks = [0, 0, 0, 0]
  Object.values(answers).forEach((a) => {
    if (picks[a.value] !== undefined) picks[a.value] += 1
  })
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="display text-[clamp(2rem,3.8vw,3.5rem)] text-balance">{tr(question.prompt)}</h1>
      <div className="mt-8 grid flex-1 grid-cols-1 content-start gap-3 md:grid-cols-2">
        {question.options.map((opt, i) => {
          const { letter, bg, Icon } = ANSWER_PLATES[i]
          const isCorrect = revealed && revealed.index === i
          const dimmed = revealed && !isCorrect
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.85 }}
              animate={{ opacity: dimmed ? 0.3 : 1, y: 0, scale: isCorrect ? 1.03 : 1 }}
              transition={{ ...pop, delay: revealed ? 0 : 0.07 * i }}
              className={`flex min-h-24 items-center gap-4 rounded-full py-3 pr-6 pl-3 ${isCorrect ? 'ring-4 ring-ink ring-offset-4 ring-offset-water' : ''}`}
              style={{ background: bg }}
            >
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-water">
                <Icon className="size-6 fill-current" aria-hidden="true" />
              </span>
              <span className="display text-3xl">{letter}</span>
              <span className="text-[clamp(1.1rem,1.8vw,1.75rem)] leading-tight font-semibold">{tr(opt)}</span>
              {revealed && (
                <span className="ml-auto flex shrink-0 items-center gap-2 text-lg font-semibold tabular">
                  {isCorrect && <Check className="size-6" strokeWidth={3} aria-hidden="true" />}
                  {picks[i]}/{teams}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function Standings({ teams, phase, mode }) {
  const { t } = useLang()
  const ranked = teams
  const answered = teams.filter((tm) => tm.answered).length
  const showGains = phase === 'reveal'
  return (
    <aside aria-labelledby="standings-heading" className="flex flex-col">
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
        <h2 id="standings-heading" className="display text-2xl">
          {t('game.standings')}
        </h2>
        {phase === 'question' && <span className="text-sm font-semibold tabular text-ink-2">{t('game.answeredCount', { a: answered, n: teams.length })}</span>}
      </div>
      <LayoutGroup>
        <ol>
          {ranked.map((team, i) => (
            <motion.li key={team.id} layout transition={pop} className="flex items-center gap-3 border-b border-ink/10 py-3">
              <span className="w-6 text-sm font-semibold tabular text-ink-2">{i + 1}</span>
              <span className="size-4 shrink-0 rounded-full" style={{ background: team.kit.bg }} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-semibold">{team.name}</span>
                {showGains && mode === 'clues' && team.lastValue && <span className="block truncate text-sm text-ink-2">“{team.lastValue}”</span>}
              </span>
              {phase === 'question' &&
                (team.answered ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={pop} className="grid size-7 place-items-center rounded-full bg-land">
                    <Check className="size-4" strokeWidth={3} aria-label={t('game.answered')} />
                  </motion.span>
                ) : (
                  team.tries > 0 ? (
                    <span className="rounded-full bg-coral/40 px-2 py-0.5 text-xs font-semibold tabular" title={t('game.wrongTries', { n: team.tries })}>
                      {t('game.wrongTries', { n: team.tries })}
                    </span>
                  ) : (
                    <span className="size-7 rounded-full border-2 border-dashed border-ink/30" aria-label={t('game.thinking')} />
                  )
                ))}
              {showGains && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...pop, delay: 0.2 + i * 0.05 }}
                  className={`rounded-full px-2.5 py-0.5 text-sm font-semibold tabular ${team.lastGain > 0 ? 'bg-land' : 'bg-water-2 text-ink-2'}`}
                >
                  {team.lastGain > 0 ? `+${team.lastGain}` : team.lastCorrect === false ? <X className="size-4" aria-label={t('game.wrong')} /> : '–'}
                </motion.span>
              )}
              <span className="display w-20 text-right text-2xl tabular">
                <RollingNumber value={team.score} />
              </span>
            </motion.li>
          ))}
        </ol>
      </LayoutGroup>
    </aside>
  )
}

export default function Game({ game }) {
  const { t } = useLang()
  const { room, meta, state, actions, question } = game
  const { mode, duration, total } = meta
  const answers = room.answers?.[state.qIndex] || {}
  const results = room.results?.[state.qIndex] || {}
  // In multi-try rooms a team is done once it is right (or out of time), not after its first guess.
  const done = (id) => Boolean(answers[id]) || Boolean(results[id] && !results[id].retry)
  const teamsArr = rankedTeams(room.teams)
  const isQuestion = state.phase === 'question'
  const isReveal = state.phase === 'reveal'
  const now = useServerNow(hostDb, isQuestion || isReveal, 100)
  const totalMs = duration * 1000
  const endsAt = state.startedAt + totalMs
  const remainingMs = isQuestion ? Math.max(0, endsAt - now) : 0
  const livePoints = pointsAt(remainingMs, totalMs)
  const timeUp = isQuestion && remainingMs <= 0
  const allAnswered = isQuestion && teamsArr.length > 0 && teamsArr.every((tm) => done(tm.id))
  const isLast = state.qIndex + 1 >= total

  // Auto flow: everyone done or time up -> show the answer; REVEAL_MS later -> next question.
  const [revealStart, setRevealStart] = useState(null)
  const [paused, setPaused] = useState(false)
  const autoRef = useRef({ shown: -1, next: -1 })
  useEffect(() => {
    setRevealStart(isReveal ? Date.now() : null)
    if (!isReveal) setPaused(false)
  }, [isReveal, state.qIndex])
  const revealLeft = revealStart ? Math.max(0, REVEAL_MS - (Date.now() - revealStart)) : REVEAL_MS
  useEffect(() => {
    if (isQuestion && (timeUp || allAnswered) && autoRef.current.shown !== state.qIndex) {
      autoRef.current.shown = state.qIndex
      actions.showAnswer()
    }
  })
  useEffect(() => {
    if (isReveal && revealStart && !paused && revealLeft <= 0 && autoRef.current.next !== state.qIndex) {
      autoRef.current.next = state.qIndex
      actions.next()
    }
  })
  const endEarly = () => {
    if (window.confirm(t('game.endConfirm'))) actions.endEarly()
  }


  // Keyboard: A / Space = show answer, N / → = next
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea')) return
      const k = e.key.toLowerCase()
      if ((k === 'a' || k === ' ') && isQuestion) {
        e.preventDefault()
        actions.showAnswer()
      } else if ((k === 'n' || k === 'arrowright') && state.phase === 'reveal') actions.next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const snapshotTeams = teamsArr.map((tm) => ({ ...tm, answered: done(tm.id), tries: results[tm.id]?.wrong ? Object.keys(results[tm.id].wrong).length : 0 }))
  const publicQuestion =
    mode === 'clues' ? { category: question.category, hints: question.hints } : { prompt: question.prompt, options: question.options }
  const revealed = state.phase === 'reveal' ? (mode === 'clues' ? { text: question.answer } : { index: question.correct }) : null

  let status = t('game.statusOpen')
  if (state.phase === 'reveal') status = t('game.statusRevealed')
  else if (allAnswered) status = t('game.statusAll')
  else if (timeUp) status = t('game.statusTimeUp')
  const urgent = timeUp || allAnswered

  return (
    <div className="flex flex-1 flex-col">
      {/* Measurements on one fixed grid */}
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-10">
        <div className="grid grid-cols-3 items-end gap-6">
          <div>
            <Label>{t('game.question')}</Label>
            <p className="display tabular mt-1 text-5xl">
              {state.qIndex + 1}
              <span className="text-ink-2">/{total}</span>
            </p>
          </div>
          <div className="text-center">
            <Label>{t('game.livePoints')}</Label>
            <p className="display tabular mt-1 text-5xl" aria-label={t('game.livePointsAria', { n: livePoints })}>
              {isQuestion ? livePoints : '–'}
            </p>
          </div>
          <div className="text-right">
            <Label>{t('game.timeLeft')}</Label>
            <p className={`display tabular mt-1 text-5xl ${remainingMs / totalMs < 0.2 && isQuestion ? 'text-alert' : ''}`}>
              {Math.ceil(remainingMs / 1000)}s
            </p>
          </div>
        </div>
        <TimeTrack remainingMs={remainingMs} totalMs={totalMs} className="mt-4 h-5" label={t('game.timeLeft')} />
      </div>

      <div className="mx-auto grid w-full max-w-[1500px] flex-1 gap-12 px-5 pt-10 pb-36 sm:px-10 lg:grid-cols-[1fr_360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.qIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={pop}
            className="flex flex-col"
          >
            {mode === 'clues' ? (
              <CluesStage question={publicQuestion} hintsRevealed={state.hintsRevealed} revealed={revealed} />
            ) : (
              <StandardStage question={publicQuestion} revealed={revealed} answers={answers} teams={teamsArr.length} />
            )}
          </motion.div>
        </AnimatePresence>
        <Standings teams={snapshotTeams} phase={state.phase} mode={mode} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink/10 bg-water">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-10">
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={pop}
            role="status"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${urgent ? 'bg-coral' : 'bg-water-2'}`}
          >
            {status}
          </motion.span>
          <div className="flex flex-wrap items-center gap-3">
            {isQuestion && (
              <motion.div animate={urgent ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 1, repeat: urgent ? Infinity : 0 }}>
                <Button variant="ink" size="lg" onClick={actions.showAnswer}>
                  <Eye className="size-5" aria-hidden="true" />
                  {t('game.showAnswer')}
                  <Kbd>A</Kbd>
                </Button>
              </motion.div>
            )}
            {isReveal && (
              <div className="flex items-center gap-3">
                <span className="relative h-2 w-28 overflow-hidden rounded-full bg-water-2" aria-hidden="true">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-land" style={{ width: `${paused ? 100 : (revealLeft / REVEAL_MS) * 100}%` }} />
                </span>
                <span className="text-sm font-semibold tabular" role="timer">
                  {paused ? t('game.autoPaused') : t(isLast ? 'game.autoFinal' : 'game.autoNext', { s: Math.ceil(revealLeft / 1000) })}
                </span>
                <Button variant="outline" size="md" onClick={() => setPaused((p) => !p)}>
                  {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
                  {paused ? t('game.resumeAuto') : t('game.pauseAuto')}
                </Button>
              </div>
            )}
            {(isQuestion || isReveal) && !isLast && (
              <Button variant="outline" size="md" onClick={endEarly}>
                <Flag className="size-4" aria-hidden="true" />
                {t('game.endEarly')}
              </Button>
            )}
            {isReveal && (
              <Button size="lg" chip onClick={actions.next}>
                {isLast ? t('game.toLeaderboard') : t('game.nextQuestion')}
                <Kbd>N</Kbd>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
