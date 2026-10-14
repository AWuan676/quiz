import { useEffect, useState } from 'react'

/** The one motion grammar: ~0.4s, overshoots, settles. */
export const pop = { type: 'spring', stiffness: 460, damping: 22, mass: 0.9 }
export const softPop = { type: 'spring', stiffness: 320, damping: 26 }

export const popIn = {
  initial: { opacity: 0, scale: 0.6, y: 24 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.85, y: -12 },
  transition: pop,
}

/** Ticks Date.now() while `active`; both tabs read the same clock, so countdowns agree. */
export function useNow(active = true, interval = 100) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return undefined
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [active, interval])
  return now
}
