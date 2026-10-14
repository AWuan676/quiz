export const MAX_POINTS = 1000

/** Current Points = Max Points × (Remaining Time / Total Time), floored at 0. */
export function pointsAt(remainingMs, totalMs) {
  if (remainingMs <= 0 || totalMs <= 0) return 0
  return Math.round(MAX_POINTS * Math.min(1, remainingMs / totalMs))
}

/** Lower-case, strip Vietnamese diacritics (incl. đ), collapse punctuation/spaces. */
export function normalizeAnswer(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function levenshtein(a, b) {
  if (a === b) return 0
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return row[b.length]
}

/**
 * Lenient match: case/diacritic/space-insensitive against every accepted alias,
 * tolerating one typo from 5 characters and two from 10.
 */
export function isAnswerMatch(input, accepted) {
  const guess = normalizeAnswer(input)
  if (!guess) return false
  const squash = (s) => s.replace(/ /g, '')
  return accepted.some((alias) => {
    const target = normalizeAnswer(alias)
    if (guess === target || squash(guess) === squash(target)) return true
    const allowed = target.length >= 10 ? 2 : target.length >= 5 ? 1 : 0
    return allowed > 0 && levenshtein(squash(guess), squash(target)) <= allowed
  })
}

export function generateRoomCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function rankTeams(teams) {
  return [...teams].sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt)
}
