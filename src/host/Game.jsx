import { useEffect } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Check, Eye, Lightbulb, Lock, SkipForward, Trophy, CircleDashed, X } from 'lucide-react'
import { Button, BoardLabel } from '../components/ui.jsx'
import SevenSeg from '../components/SevenSeg.jsx'
import ShotClock from '../components/ShotClock.jsx'
import RollingNumber from '../components/RollingNumber.jsx'
import { ANSWER_PLATES } from '../lib/kits.js'
import { pointsAt, rankTeams } from '../lib/scoring.js'
import { pop, useNow } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

function Kbd({ children }) {
  return <kbd className="ml-1 rounded-md bg-ink/15 px-1.5 py-0.5 font-sans text-sm font-bold">{children}</kbd>
}

function CluesStage({ question, hintsRevealed, revealed }) {
  const { t, tr } = useLang()
  return (
    <div className="flex flex-1 flex-col">
      <p className="font-display text-[clamp(1.5rem,2.4vw,2.5rem)] font-black tracking-wide text-ink-2 uppercase">
        {t('game.cluesPrompt')} <span className="text-ink">{tr(question.category)}</span>
      </p>
      <ol className="mt-5 flex flex-col gap-3">
        {question.hints.map((hint, i) => {
          const open = i < hintsRevealed
          return (
            <li key={i}>
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, x: -60, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={pop}
                    className="flex items-center gap-5 rounded-2xl bg-paper p-4 pr-6 shadow-[0_8px_20px_-12px_rgb(18_20_28/0.35)]"
                  >
                    <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-board">
                      <SevenSeg value={i + 1} className="h-9 text-led" />
                    </span>
                    <span className="text-[clamp(1.25rem,2.2vw,2.25rem)] leading-tight font-semibold text-ink">{tr(hint)}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="flex items-center gap-5 rounded-2xl bg-board p-4 led-lattice"
                  >
                    <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-board-2">
                      <SevenSeg value={i + 1} className="h-9 text-board-text/30" />
                    </span>
                    <Lock className="size-6 text-board-text/50" aria-hidden="true" />
                    <span className="font-display text-xl font-extrabold tracking-[0.16em] text-board-text/60 uppercase">{t('game.hintLocked')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={pop}
            className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1 rounded-2xl bg-led px-6 py-5 shadow-[0_14px_30px_-12px_rgb(255_180_0/0.8)]"
          >
            <span className="font-display text-xl font-black tracking-[0.18em] text-ink/70 uppercase">{t('game.answerIs')}</span>
            <span className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-black text-ink uppercase">{tr(revealed.text)}</span>
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
      <h1 className="text-[clamp(2rem,3.8vw,3.75rem)] leading-[1.08] font-bold text-balance text-ink">{tr(question.prompt)}</h1>
      <div className="mt-8 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
        {question.options.map((opt, i) => {
          const { letter, bg, fg, Icon } = ANSWER_PLATES[i]
          const isCorrect = revealed && revealed.index === i
          const dimmed = revealed && !isCorrect
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: dimmed ? 0.28 : 1, y: 0, scale: isCorrect ? 1.03 : dimmed ? 0.97 : 1 }}
              transition={{ ...pop, delay: revealed ? 0 : 0.08 * i }}
              className={`relative flex min-h-28 items-center gap-5 rounded-2xl px-6 py-5 ${isCorrect ? 'ring-[6px] ring-ink' : ''}`}
              style={{ background: bg, color: fg }}
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-black/15">
                <Icon className="size-8 fill-current" aria-hidden="true" />
              </span>
              <span className="font-display text-4xl font-black">{letter}</span>
              <span className="text-[clamp(1.25rem,2vw,2rem)] leading-tight font-bold">{tr(opt)}</span>
              {revealed && (
                <span className="ml-auto flex items-center gap-2 font-display text-2xl font-black">
                  {isCorrect && <Check className="size-8" strokeWidth={3.5} aria-hidden="true" />}
                  <span className="rounded-lg bg-black/20 px-3 py-1 tabular">
                    {picks[i]}/{teams}
                  </span>
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
  const ranked = rankTeams(teams)
  const answered = teams.filter((tm) => tm.answered).length
  const showGains = phase === 'reveal'
  return (
    <aside aria-labelledby="standings-heading" className="flex flex-col rounded-3xl bg-board p-5 led-lattice">
      <div className="flex items-center justify-between gap-3">
        <h2 id="standings-heading">
          <BoardLabel className="text-base">{t('game.standings')}</BoardLabel>
        </h2>
        {phase === 'question' && (
          <span className="rounded-full bg-board-2 px-3 py-1 font-display text-base font-extrabold text-led tabular">
            {t('game.answeredCount', { a: answered, n: teams.length })}
          </span>
        )}
      </div>
      <LayoutGroup>
        <ol className="mt-4 flex flex-col gap-2">
          {ranked.map((team, i) => (
            <motion.li
              key={team.id}
              layout
              transition={pop}
              className="flex items-center gap-3 rounded-xl bg-board-2 py-2 pr-3 pl-2"
            >
              <span className="w-6 text-center font-display text-xl font-black text-board-text tabular">{i + 1}</span>
              <span
                className="grid size-9 shrink-0 place-items-center rounded-lg font-display text-lg font-black"
                style={{ background: team.kit.bg, color: team.kit.fg }}
              >
                {team.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-xl leading-tight font-extrabold text-white uppercase">{team.name}</span>
                {showGains && mode === 'clues' && team.lastValue && (
                  <span className="block truncate text-sm text-board-text">“{team.lastValue}”</span>
                )}
              </span>
              {phase === 'question' &&
                (team.answered ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={pop} className="grid size-7 place-items-center rounded-full bg-led text-ink">
                    <Check className="size-4" strokeWidth={3.5} aria-label={t('game.answered')} />
                  </motion.span>
                ) : (
                  <CircleDashed className="size-6 animate-spin text-board-text/50 [animation-duration:3s]" aria-label={t('game.thinking')} />
                ))}
              {showGains && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...pop, delay: 0.2 + i * 0.05 }}
                  className={`rounded-md px-2 py-0.5 font-display text-base font-black tabular ${
                    team.lastGain > 0 ? 'bg-kit-green text-white' : 'bg-board-3 text-board-text'
                  }`}
                >
                  {team.lastGain > 0 ? `+${team.lastGain}` : team.lastCorrect === false ? <X className="size-4" aria-label={t('game.wrong')} /> : '—'}
                </motion.span>
              )}
              <span className="w-20 text-right font-display text-2xl font-black text-led">
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
  const { state, actions, total, question } = game
  const isQuestion = state.phase === 'question'
  const now = useNow(isQuestion, 100)
  const totalMs = state.duration * 1000
  const endsAt = state.startedAt + totalMs
  const remainingMs = isQuestion ? Math.max(0, endsAt - now) : 0
  const livePoints = pointsAt(remainingMs, totalMs)
  const timeUp = isQuestion && remainingMs <= 0
  const allAnswered = isQuestion && state.teams.length > 0 && state.teams.every((tm) => state.answers[tm.id])
  const isLast = state.qIndex + 1 >= total
  const canHint = isQuestion && state.mode === 'clues' && state.hintsRevealed < 4 && !timeUp

  // Keyboard: H = next hint, A / Space = show answer, N / → = next
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea')) return
      const k = e.key.toLowerCase()
      if (k === 'h' && canHint) actions.revealHint()
      else if ((k === 'a' || k === ' ') && isQuestion) {
        e.preventDefault()
        actions.showAnswer()
      } else if ((k === 'n' || k === 'arrowright') && state.phase === 'reveal') actions.next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const snapshotTeams = state.teams.map((tm) => ({ ...tm, answered: Boolean(state.answers[tm.id]) }))
  const publicQuestion =
    state.mode === 'clues'
      ? { category: question.category, hints: question.hints }
      : { prompt: question.prompt, options: question.options }
  const revealed = state.phase === 'reveal' ? (state.mode === 'clues' ? { text: question.answer } : { index: question.correct }) : null

  let status = t('game.statusOpen')
  if (state.phase === 'reveal') status = t('game.statusRevealed')
  else if (allAnswered) status = t('game.statusAll')
  else if (timeUp) status = t('game.statusTimeUp')

  return (
    <div className="flex flex-1 flex-col">
      {/* Scoreboard strip */}
      <div className="bg-board px-4 pt-4 pb-5 sm:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="flex items-end gap-8">
            <div>
              <BoardLabel>{t('game.question')}</BoardLabel>
              <div className="mt-1 flex items-center gap-2">
                <SevenSeg value={state.qIndex + 1} className="h-14 text-led" />
                <span className="font-display text-4xl font-black text-board-text/50">/</span>
                <SevenSeg value={total} className="h-14 text-board-text/70" />
              </div>
            </div>
            <div className="hidden sm:block">
              <BoardLabel>{t('game.mode')}</BoardLabel>
              <p className="mt-2 font-display text-3xl font-black text-white uppercase">{t(`mode.${state.mode}`)}</p>
            </div>
          </div>
          <div className="flex items-end gap-8">
            <div className="text-right">
              <BoardLabel>{t('game.livePoints')}</BoardLabel>
              <div className="mt-1">
                <SevenSeg value={isQuestion ? livePoints : '----'} length={4} className="h-14 text-led" label={t('game.livePointsAria', { n: livePoints })} />
              </div>
            </div>
            <div className="text-right">
              <BoardLabel>{t('game.timeLeft')}</BoardLabel>
              <div className="mt-1">
                <SevenSeg
                  value={Math.ceil(remainingMs / 1000)}
                  length={2}
                  className={`h-14 ${remainingMs / totalMs < 0.2 ? 'text-led-hot' : 'text-led'}`}
                  label={t('common.seconds', { n: Math.ceil(remainingMs / 1000) })}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-4 max-w-[1600px]">
          <ShotClock remainingMs={remainingMs} totalMs={totalMs} cells={60} className="h-9" label={t('game.timeLeft')} />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-6 px-4 py-6 pb-32 sm:px-8 lg:grid-cols-[1fr_400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.qIndex}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={pop}
            className="flex flex-col"
          >
            {state.mode === 'clues' ? (
              <CluesStage question={publicQuestion} hintsRevealed={state.hintsRevealed} revealed={revealed} />
            ) : (
              <StandardStage question={publicQuestion} revealed={revealed} answers={state.answers} teams={state.teams.length} />
            )}
          </motion.div>
        </AnimatePresence>
        <Standings teams={snapshotTeams} phase={state.phase} mode={state.mode} />
      </div>

      {/* Host controls */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-concrete/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={pop}
            className={`rounded-full px-4 py-2 font-display text-lg font-extrabold tracking-wide uppercase ${
              timeUp || allAnswered ? 'bg-led-hot text-white' : 'bg-board text-led'
            }`}
            role="status"
          >
            {status}
          </motion.span>
          <div className="flex flex-wrap items-center gap-3">
            {state.mode === 'clues' && isQuestion && (
              <Button variant="board" size="lg" onClick={actions.revealHint} disabled={!canHint}>
                <Lightbulb className="size-6" aria-hidden="true" />
                {t('game.nextHint', { n: Math.min(state.hintsRevealed + 1, 4) })}
                <Kbd>H</Kbd>
              </Button>
            )}
            {isQuestion && (
              <motion.div animate={timeUp || allAnswered ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 1, repeat: timeUp || allAnswered ? Infinity : 0 }}>
                <Button size="lg" onClick={actions.showAnswer}>
                  <Eye className="size-6" aria-hidden="true" />
                  {t('game.showAnswer')}
                  <Kbd>A</Kbd>
                </Button>
              </motion.div>
            )}
            {state.phase === 'reveal' && (
              <Button size="lg" variant={isLast ? 'pitch' : 'led'} onClick={actions.next}>
                {isLast ? <Trophy className="size-6" aria-hidden="true" /> : <SkipForward className="size-6" aria-hidden="true" />}
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
