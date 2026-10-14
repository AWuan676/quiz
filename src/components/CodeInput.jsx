import { useState } from 'react'
import { motion } from 'framer-motion'
import { pop } from '../lib/motion.js'

/** Six LED cells over one real numeric input (keyboard, paste and autofill all work). */
export default function CodeInput({ value, onChange, label, autoFocus, invalid, id = 'room-code' }) {
  const [focused, setFocused] = useState(false)
  const cells = Array.from({ length: 6 }, (_, i) => value[i] ?? '')
  const active = Math.min(value.length, 5)

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="grid grid-cols-6 gap-2" aria-hidden="true">
        {cells.map((ch, i) => {
          const isActive = focused && i === active
          return (
            <div
              key={i}
              className={`relative grid aspect-[3/4] place-items-center rounded-xl bg-board-2 led-lattice ring-2 transition-colors ${
                invalid ? 'ring-led-hot' : isActive ? 'ring-led' : 'ring-transparent'
              }`}
            >
              {ch ? (
                <motion.span
                  key={ch + i}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={pop}
                  className="font-display text-[clamp(2rem,6vw,3.25rem)] leading-none font-black text-led tabular [text-shadow:0_0_14px_rgb(255_180_0/0.55)]"
                >
                  {ch}
                </motion.span>
              ) : (
                isActive && <span className="h-1 w-1/3 translate-y-5 rounded-full bg-led animate-blink" />
              )}
            </div>
          )
        })}
      </div>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        autoFocus={autoFocus}
        aria-invalid={invalid || undefined}
        className="absolute inset-0 h-full w-full cursor-text bg-transparent text-base text-transparent caret-transparent opacity-0"
      />
    </div>
  )
}
