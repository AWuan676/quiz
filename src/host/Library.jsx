import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy, Pencil, Play, Plus, Trash2, Minus, LoaderCircle } from 'lucide-react'
import { Button, Label } from '../components/ui.jsx'
import { Blob } from '../components/Lobe.jsx'
import { TIME_OPTIONS } from '../data/quizzes.js'
import { MAX_QUESTIONS, blankQuestion, createQuiz, deleteQuiz, questionIssues, sampleQuiz, watchMyQuizzes } from '../lib/quizStore.js'
import { createRoom } from './useHostRoom.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

function Stepper({ value, onChange, min, max, label, unit }) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="−" className="grid size-11 place-items-center rounded-full ring-2 ring-inset ring-ink/15 disabled:opacity-30">
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="display tabular w-16 text-center text-3xl" aria-live="polite">
        {value}
        {unit && <span className="ml-1 text-base text-ink-2">{unit}</span>}
      </span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="+" className="grid size-11 place-items-center rounded-full ring-2 ring-inset ring-ink/15 disabled:opacity-30">
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

function NewQuizPanel({ user, navigate, onClose }) {
  const { t, lang } = useLang()
  const [mode, setMode] = useState('standard')
  const [count, setCount] = useState(5)
  const [duration, setDuration] = useState(30)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)

  const create = async () => {
    setBusy(true)
    const id = await createQuiz(user.uid, {
      title: title.trim() || t('library.untitled'),
      mode,
      duration,
      questions: Array.from({ length: count }, () => blankQuestion(mode)),
    })
    navigate(`/host/edit/${id}`)
  }
  const fromSample = async (m) => {
    setBusy(true)
    const id = await createQuiz(user.uid, sampleQuiz(m, lang))
    navigate(`/host/edit/${id}`)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={pop}
      className="mt-8 rounded-[2.5rem] bg-paper p-6 ring-2 ring-inset ring-ink/10 sm:p-8"
      aria-labelledby="new-quiz-heading"
    >
      <h2 id="new-quiz-heading" className="display text-2xl">
        {t('library.newTitle')}
      </h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <label htmlFor="quiz-title">
            <Label>{t('editor.title')}</Label>
          </label>
          <input
            id="quiz-title"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 80))}
            placeholder={t('editor.titlePlaceholder')}
            className="mt-2 h-14 w-full rounded-full bg-water px-6 text-lg font-semibold ring-2 ring-inset ring-ink/10 outline-none focus:ring-ink"
          />
          <p className="mt-6">
            <Label>{t('setup.modeHeading')}</Label>
          </p>
          <div role="radiogroup" aria-label={t('setup.modeHeading')} className="mt-2 flex flex-wrap gap-2">
            {['standard', 'clues'].map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={`h-12 rounded-full px-5 text-base font-semibold transition-colors ${mode === m ? 'bg-ink text-water' : 'ring-2 ring-inset ring-ink/15 hover:ring-ink/40'}`}
              >
                {t(`mode.${m}`)}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{t(`mode.${mode}.desc`)}</p>
        </div>
        <div className="grid content-start gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <Label>{t('library.count')}</Label>
            <div className="mt-2">
              <Stepper value={count} onChange={setCount} min={1} max={MAX_QUESTIONS} label={t('library.count')} />
            </div>
          </div>
          <div>
            <Label>{t('setup.timeHeading')}</Label>
            <div role="radiogroup" aria-label={t('setup.timeHeading')} className="mt-2 flex flex-wrap gap-2">
              {TIME_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={duration === s}
                  onClick={() => setDuration(s)}
                  className={`h-11 min-w-16 rounded-full px-4 text-sm font-semibold tabular transition-colors ${duration === s ? 'bg-ink text-water' : 'ring-2 ring-inset ring-ink/15 hover:ring-ink/40'}`}
                >
                  {t('common.seconds', { n: s })}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink/10 pt-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-2">{t('library.orSample')}</span>
          <button type="button" disabled={busy} onClick={() => fromSample('standard')} className="rounded-full bg-sun px-4 py-2 font-semibold">
            {t('mode.standard')}
          </button>
          <button type="button" disabled={busy} onClick={() => fromSample('clues')} className="rounded-full bg-lilac px-4 py-2 font-semibold">
            {t('mode.clues')}
          </button>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="md" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button size="md" chip onClick={create} disabled={busy}>
            {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {t('library.createAndWrite')}
          </Button>
        </div>
      </div>
    </motion.section>
  )
}

function PlayPanel({ quiz, user, navigate, onClose }) {
  const { t } = useLang()
  const [maxTeam, setMaxTeam] = useState(4)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const open = async () => {
    setBusy(true)
    setError(null)
    try {
      const code = await createRoom(user.uid, quiz, maxTeam)
      navigate(`/host/room/${code}`)
    } catch {
      setError(t('library.roomFailed'))
      setBusy(false)
    }
  }
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="overflow-hidden"
    >
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6 rounded-[2rem] bg-land/40 p-5">
        <div>
          <Label>{t('room.maxTeam')}</Label>
          <div className="mt-2">
            <Stepper value={maxTeam} onChange={setMaxTeam} min={1} max={10} label={t('room.maxTeam')} unit={t('room.people')} />
          </div>
          <p className="mt-2 text-sm text-ink-2">{maxTeam === 1 ? t('room.solo') : t('room.teamHint', { n: maxTeam })}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="md" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button size="lg" chip onClick={open} disabled={busy}>
            {busy && <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />}
            {t('setup.openRoom')}
          </Button>
        </div>
        {error && <p role="alert" className="w-full text-sm font-semibold text-alert">{error}</p>}
      </div>
    </motion.div>
  )
}

export default function Library({ user, navigate }) {
  const { t } = useLang()
  const [quizzes, setQuizzes] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [playing, setPlaying] = useState(null)

  useEffect(() => watchMyQuizzes(user.uid, setQuizzes, () => setLoadError(true)), [user.uid])

  const duplicate = (q) => createQuiz(user.uid, { ...q, title: `${q.title} (${t('library.copy')})` })
  const remove = (q) => {
    if (window.confirm(t('library.confirmDelete', { title: q.title }))) deleteQuiz(q.id)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-4 pb-20 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(2.5rem,6vw,4.5rem)]">{t('library.title')}</h1>
          <p className="mt-3 text-lg text-ink-2">{t('library.hello', { name: user.displayName?.split(' ').slice(-1)[0] ?? '' })}</p>
        </div>
        {!showNew && (
          <Button size="lg" chip onClick={() => setShowNew(true)}>
            {t('library.new')}
          </Button>
        )}
      </div>

      <AnimatePresence>{showNew && <NewQuizPanel user={user} navigate={navigate} onClose={() => setShowNew(false)} />}</AnimatePresence>

      <section className="mt-12" aria-label={t('library.title')}>
        {loadError && <p role="alert" className="rounded-3xl bg-coral/25 px-5 py-4 font-semibold">{t('library.loadError')}</p>}
        {!quizzes && !loadError && (
          <p className="flex items-center gap-3 text-ink-2">
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> {t('common.loading')}
          </p>
        )}
        {quizzes?.length === 0 && !showNew && (
          <div className="flex flex-col items-start gap-4 py-10">
            <Blob variant={2} color="var(--color-water-2)" className="size-24" />
            <p className="display text-2xl">{t('library.empty')}</p>
            <p className="max-w-md text-ink-2">{t('library.emptyBody')}</p>
          </div>
        )}
        <ul className="border-t-2 border-ink">
          {quizzes?.map((q) => {
            const incomplete = q.questions.filter((x) => questionIssues(q.mode, x).length).length
            return (
              <motion.li key={q.id} layout transition={pop} className="border-b border-ink/10 py-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xl font-semibold">{q.title}</p>
                    <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-ink-2">
                      <span>{t(`mode.${q.mode}`)}</span>
                      <span className="tabular">{t('setup.questionCount', { n: q.questions.length })}</span>
                      <span className="tabular">{t('common.seconds', { n: q.duration })}</span>
                      {incomplete > 0 && <span className="font-semibold text-alert">{t('library.incomplete', { n: incomplete })}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => navigate(`/host/edit/${q.id}`)} className="grid size-11 place-items-center rounded-full hover:bg-ink/5" aria-label={t('library.edit')} title={t('library.edit')}>
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => duplicate(q)} className="grid size-11 place-items-center rounded-full hover:bg-ink/5" aria-label={t('library.duplicate')} title={t('library.duplicate')}>
                      <Copy className="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => remove(q)} className="grid size-11 place-items-center rounded-full hover:bg-ink/5" aria-label={t('library.delete')} title={t('library.delete')}>
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                    <Button
                      size="md"
                      variant="ink"
                      className="ml-2"
                      disabled={incomplete > 0 || q.questions.length === 0}
                      onClick={() => setPlaying(playing === q.id ? null : q.id)}
                      title={incomplete ? t('library.fixFirst') : undefined}
                    >
                      <Play className="size-4 fill-current" aria-hidden="true" />
                      {t('library.play')}
                    </Button>
                  </div>
                </div>
                <AnimatePresence>{playing === q.id && <PlayPanel quiz={q} user={user} navigate={navigate} onClose={() => setPlaying(null)} />}</AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
