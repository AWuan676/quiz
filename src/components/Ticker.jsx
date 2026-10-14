import { Fragment } from 'react'

/** The scoreboard's scrolling message strip. States print here instead of toasts. */
export default function Ticker({ items, className = '' }) {
  const row = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="px-6 whitespace-nowrap">{item}</span>
          <span className="size-2 rotate-45 bg-led/70" />
        </Fragment>
      ))}
    </div>
  )
  return (
    <div className={`relative overflow-hidden bg-board text-led led-lattice ${className}`} role="status" aria-live="polite">
      <span className="sr-only">{items[0]}</span>
      <div className="flex w-max animate-ticker py-2 font-display text-lg font-extrabold tracking-[0.12em] uppercase" aria-hidden="true">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-board to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-board to-transparent" />
    </div>
  )
}
