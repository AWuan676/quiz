/**
 * The draining path: a capsule track that empties as points fall.
 * Land green while healthy, sun past half, coral in the last fifth.
 */
export default function TimeTrack({ remainingMs, totalMs, className = 'h-4', label }) {
  const ratio = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0
  const color = ratio > 0.5 ? 'var(--color-land)' : ratio > 0.2 ? 'var(--color-sun)' : 'var(--color-coral)'
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(totalMs / 1000)}
      aria-valuenow={Math.ceil(remainingMs / 1000)}
      className={`overflow-hidden rounded-full bg-water-2 ${className}`}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${ratio * 100}%`, background: color, transition: 'width 120ms linear, background 300ms ease-out' }}
      />
    </div>
  )
}
