import { useState } from 'react'
import { motion } from 'framer-motion'
import { pop } from '../lib/motion.js'

/** Six capsule cells over one real numeric input (keyboard, paste and autofill all work). */
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
              className={`grid aspect-[4/5] place-items-center rounded-2xl bg-paper ring-2 ring-inset transition-colors ${
                invalid ? 'ring-coral' : isActive ? 'ring-ink' : ch ? 'ring-ink/25' : 'ring-ink/10'
              }`}
            >
              {ch ? (
                <motion.span
                  key={ch + i}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={pop}
                  className="display tabular text-[clamp(1.75rem,6vw,2.75rem)]"
                >
                  {ch}
                </motion.span>
              ) : (
                isActive && <span className="h-1 w-1/3 translate-y-4 rounded-full bg-ink" />
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
