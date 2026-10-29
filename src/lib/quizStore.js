import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { firestore } from './firebase.js'
import { CLUE_QUESTIONS, STANDARD_QUESTIONS } from '../data/quizzes.js'

export const MAX_QUESTIONS = 50

export function blankQuestion(mode) {
  return mode === 'clues'
    ? { category: '', hints: ['', '', '', ''], answer: '', accept: '' }
    : { prompt: '', options: ['', '', '', ''], correct: 0 }
}

/** Problems that stop a question from being played, as i18n keys. */
export function questionIssues(mode, q) {
  const issues = []
  if (mode === 'clues') {
    if (q.hints.some((h) => !h.trim())) issues.push('editor.issue.hints')
    if (!q.answer.trim()) issues.push('editor.issue.answer')
  } else {
    if (!q.prompt.trim()) issues.push('editor.issue.prompt')
    if (q.options.some((o) => !o.trim())) issues.push('editor.issue.options')
  }
  return issues
}

/** Every spelling that should score for a Convergent Clues question. */
export function acceptedAnswers(q) {
  return [q.answer, ...String(q.accept || '').split(',')].map((s) => s.trim()).filter(Boolean)
}

/** The built-in sample sets, flattened into one language so they can be edited. */
export function sampleQuiz(mode, lang) {
  const pick = (o) => o[lang] ?? o.en
  if (mode === 'clues') {
    return {
      title: lang === 'vi' ? 'Bộ mẫu: Gợi ý hội tụ' : 'Sample: Convergent Clues',
      mode,
      duration: 45,
      questions: CLUE_QUESTIONS.map((q) => ({
        category: pick(q.category),
        hints: q.hints.map(pick),
        answer: pick(q.answer),
        accept: q.accept.join(', '),
      })),
    }
  }
  return {
    title: lang === 'vi' ? 'Bộ mẫu: Trắc nghiệm' : 'Sample: Standard Quiz',
    mode,
    duration: 30,
    questions: STANDARD_QUESTIONS.map((q) => ({ prompt: pick(q.prompt), options: q.options.map(pick), correct: q.correct })),
  }
}

const quizzes = () => collection(firestore, 'quizzes')

export function watchMyQuizzes(uid, onChange, onError) {
  // Sorted here rather than with orderBy, which would need a composite index.
  const q = query(quizzes(), where('ownerUid', '==', uid))
  const time = (d) => d.updatedAt?.toMillis?.() ?? Date.now()
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => time(b) - time(a))),
    onError,
  )
}

export async function createQuiz(uid, data) {
  const ref = await addDoc(quizzes(), {
    ownerUid: uid,
    title: data.title,
    mode: data.mode,
    duration: data.duration,
    questions: data.questions,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function loadQuiz(id) {
  const snap = await getDoc(doc(firestore, 'quizzes', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export function saveQuiz(id, data) {
  return updateDoc(doc(firestore, 'quizzes', id), {
    title: data.title,
    duration: data.duration,
    questions: data.questions,
    updatedAt: serverTimestamp(),
  })
}

export const deleteQuiz = (id) => deleteDoc(doc(firestore, 'quizzes', id))
