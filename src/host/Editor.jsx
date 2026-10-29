import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowUp, Check, LoaderCircle, Plus, Trash2, TriangleAlert } from 'lucide-react'
import { Button, Label } from '../components/ui.jsx'
import { TIME_OPTIONS } from '../data/quizzes.js'
import { ANSWER_PLATES } from '../lib/kits.js'
import { MAX_QUESTIONS, blankQuestion, loadQuiz, questionIssues, saveQuiz } from '../lib/quizStore.js'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

const field = 'w-full rounded-3xl bg-water px-5 py-3 text-base ring-2 ring-inset ring-ink/10 outline-none placeholder:text-ink-2/70 focus:ring-ink'

function CluesFields({ q, set }) {
  const { t } = useLang()
  return (
    <div className="grid gap-4">
      <label className="grid gap-1.5">
        <Label>{t('editor.category')}</Label>
        <input className={field} value={q.category} onChange={(e) => set({ category: e.target.value })} placeholder={t('editor.categoryPlaceholder')} />
      </label>
      {q.hints.map((h, i) => (
        <label key={i} className="flex items-start gap-3">
          <span className="mt-2 grid size-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-water">{i + 1}</span>
          <textarea
            rows={2}
            className={`${field} resize-y`}
            value={h}
            aria-label={t('editor.hintN', { n: i + 1 })}
            placeholder={i === 0 ? t('editor.hintFirst') : i === 3 ? t('editor.hintLast') : t('editor.hintN', { n: i + 1 })}
            onChange={(e) => set({ hints: q.hints.map((x, j) => (j === i ? e.target.value : x)) })}
          />
        </label>
      ))}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <Label>{t('editor.answer')}</Label>
          <input className={`${field} font-semibold`} value={q.answer} onChange={(e) => set({ answer: e.target.value })} />
        </label>
        <label className="grid gap-1.5">
          <Label>{t('editor.accept')}</Label>
          <input className={field} value={q.accept} onChange={(e) => set({ accept: e.target.value })} placeholder={t('editor.acceptPlaceholder')} />
        </label>
      </div>
    </div>
  )
}

function StandardFields({ q, set, index }) {
  const { t } = useLang()
  return (
    <div className="grid gap-4">
      <label className="grid gap-1.5">
        <Label>{t('editor.prompt')}</Label>
        <textarea rows={2} className={`${field} resize-y text-lg font-semibold`} value={q.prompt} onChange={(e) => set({ prompt: e.target.value })} />
      </label>
      <fieldset className="grid gap-2 sm:grid-cols-2">
        <legend className="mb-1.5">
          <Label>{t('editor.options')}</Label>
        </legend>
        {q.options.map((o, i) => {
          const { letter, bg, Icon } = ANSWER_PLATES[i]
          const correct = q.correct === i
          return (
            <div key={i} className={`flex items-center gap-2 rounded-full p-1.5 pr-2 ${correct ? 'ring-[3px] ring-ink' : ''}`} style={{ background: bg }}>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-water">
                <Icon className="size-4 fill-current" aria-hidden="true" />
              </span>
              <input
                className="min-w-0 flex-1 rounded-full bg-water/80 px-4 py-2 text-base outline-none focus:bg-water"
                value={o}
                aria-label={t('editor.optionN', { l: letter })}
                placeholder={t('editor.optionN', { l: letter })}
                onChange={(e) => set({ options: q.options.map((x, j) => (j === i ? e.target.value : x)) })}
              />
              <label className={`grid size-10 shrink-0 cursor-pointer place-items-center rounded-full ${correct ? 'bg-ink text-water' : 'bg-water/60'}`} title={t('editor.markCorrect')}>
                <input type="radio" name={`correct-${index}`} checked={correct} onChange={() => set({ correct: i })} className="sr-only" aria-label={t('editor.markCorrectN', { l: letter })} />
                <Check className={`size-4 ${correct ? '' : 'opacity-30'}`} strokeWidth={3} aria-hidden="true" />
              </label>
            </div>
          )
        })}
      </fieldset>
    </div>
  )
}

export default function Editor({ quizId, navigate }) {
  const { t } = useLang()
  const [quiz, setQuiz] = useState(null)
  const [missing, setMissing] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    loadQuiz(quizId)
      .then((q) => (q ? setQuiz(q) : setMissing(true)))
      .catch(() => setMissing(true))
  }, [quizId])

  useEffect(() => {
    if (!dirty) return undefined
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const edit = (patch) => {
    setQuiz((q) => ({ ...q, ...patch }))
    setDirty(true)
  }
  const setQuestion = (i, patch) => edit({ questions: quiz.questions.map((q, j) => (j === i ? { ...q, ...patch } : q)) })
  const move = (i, d) => {
    const qs = [...quiz.questions]
    ;[qs[i], qs[i + d]] = [qs[i + d], qs[i]]
    edit({ questions: qs })
  }

  const issues = useMemo(() => (quiz ? quiz.questions.map((q) => questionIssues(quiz.mode, q)) : []), [quiz])
  const incomplete = issues.filter((x) => x.length).length

  const save = async () => {
    setSaving(true)
    try {
      await saveQuiz(quizId, quiz)
      setDirty(false)
      setSavedAt(new Date())
    } finally {
      setSaving(false)
    }
  }

  const back = () => {
    if (dirty && !window.confirm(t('editor.leaveUnsaved'))) return
    navigate('/host')
  }

  if (missing) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <p className="display text-3xl">{t('editor.missing')}</p>
        <Button variant="outline" size="md" className="mt-6" onClick={() => navigate('/host')}>
          {t('library.title')}
        </Button>
      </div>
    )
  }
  if (!quiz) {
    return (
      <p className="flex items-center gap-3 px-10 py-10 text-ink-2">
        <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> {t('common.loading')}
      </p>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pt-2 pb-36 sm:px-10">
      <button type="button" onClick={back} className="inline-flex h-10 items-center gap-2 rounded-full pr-4 text-sm font-semibold hover:bg-ink/5">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('library.title')}
      </button>

      <label htmlFor="title" className="mt-4 block">
        <Label>{t('editor.title')}</Label>
      </label>
      <input
        id="title"
        value={quiz.title}
        onChange={(e) => edit({ title: e.target.value.slice(0, 80) })}
        className="display mt-1 w-full bg-transparent text-[clamp(2rem,5vw,3.5rem)] outline-none placeholder:text-ink-2/50 focus:underline focus:decoration-land focus:decoration-4 focus:underline-offset-8"
        placeholder={t('editor.titlePlaceholder')}
      />

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="rounded-full bg-sun px-4 py-1.5 text-sm font-semibold">{t(`mode.${quiz.mode}`)}</span>
        <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={t('setup.timeHeading')}>
          <Label className="mr-1">{t('setup.timeHeading')}</Label>
          {TIME_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={quiz.duration === s}
              onClick={() => edit({ duration: s })}
              className={`h-9 rounded-full px-3 text-sm font-semibold tabular ${quiz.duration === s ? 'bg-ink text-water' : 'ring-2 ring-inset ring-ink/15 hover:ring-ink/40'}`}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      <ol className="mt-10 grid gap-6">
        <AnimatePresence initial={false}>
          {quiz.questions.map((q, i) => (
            <motion.li
              key={i}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={pop}
              className="rounded-[2.25rem] bg-paper p-5 ring-2 ring-inset ring-ink/10 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="display text-2xl">
                  {t('editor.questionN', { n: i + 1 })}
                  {issues[i].length > 0 && (
                    <span className="ml-3 inline-flex items-center gap-1.5 align-middle text-sm font-semibold tracking-normal text-alert">
                      <TriangleAlert className="size-4" aria-hidden="true" />
                      {issues[i].map((k) => t(k)).join(', ')}
                    </span>
                  )}
                </p>
                <div className="flex items-center">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-10 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-25" aria-label={t('editor.moveUp')}>
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </button>
                  <button type="button" disabled={i === quiz.questions.length - 1} onClick={() => move(i, 1)} className="grid size-10 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-25" aria-label={t('editor.moveDown')}>
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={quiz.questions.length <= 1}
                    onClick={() => edit({ questions: quiz.questions.filter((_, j) => j !== i) })}
                    className="grid size-10 place-items-center rounded-full hover:bg-coral/30 disabled:opacity-25"
                    aria-label={t('editor.deleteQ', { n: i + 1 })}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {quiz.mode === 'clues' ? (
                <CluesFields q={q} set={(p) => setQuestion(i, p)} />
              ) : (
                <StandardFields q={q} index={i} set={(p) => setQuestion(i, p)} />
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      <button
        type="button"
        disabled={quiz.questions.length >= MAX_QUESTIONS}
        onClick={() => edit({ questions: [...quiz.questions, blankQuestion(quiz.mode)] })}
        className="mt-6 flex h-16 w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-ink/25 text-base font-semibold hover:border-ink hover:bg-ink/5 disabled:opacity-30"
      >
        <Plus className="size-5" aria-hidden="true" />
        {t('editor.addQuestion')}
      </button>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink/10 bg-water">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-10">
          <p className="text-sm text-ink-2" role="status">
            {t('setup.questionCount', { n: quiz.questions.length })}
            {incomplete > 0 && <span className="font-semibold text-alert"> · {t('library.incomplete', { n: incomplete })}</span>}
            {' · '}
            {dirty ? t('editor.unsaved') : savedAt ? t('editor.saved') : t('editor.upToDate')}
          </p>
          <Button size="lg" variant={dirty ? 'land' : 'outline'} onClick={save} disabled={saving || !dirty}>
            {saving ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Check className="size-5" aria-hidden="true" />}
            {t('editor.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
