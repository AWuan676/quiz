/**
 * The signature: a row of LED cells that go dark as points drain.
 * Amber while healthy, orange past half, hot red in the last fifth.
 */
export default function ShotClock({ remainingMs, totalMs, cells = 48, className = '', label }) {
  const ratio = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0
  const lit = Math.ceil(ratio * cells)
  const color = ratio > 0.5 ? 'var(--color-led)' : ratio > 0.2 ? '#FF8A1F' : 'var(--color-led-hot)'
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(totalMs / 1000)}
      aria-valuenow={Math.ceil(remainingMs / 1000)}
      className={`flex gap-[3px] rounded-lg bg-board p-1.5 led-lattice ${className}`}
    >
      {Array.from({ length: cells }, (_, i) => {
        const on = i < lit
        return (
          <span
            key={i}
            className="h-full flex-1 rounded-[2px]"
            style={{
              background: on ? color : 'rgb(255 255 255 / 0.06)',
              boxShadow: on ? `0 0 10px ${color}` : 'none',
              transition: 'background 160ms ease-out, box-shadow 160ms ease-out',
            }}
          />
        )
      })}
    </div>
  )
}
