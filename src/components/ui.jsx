import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

const VARIANTS = {
  led: 'bg-led text-ink shadow-[0_6px_0_#B37E00,0_14px_24px_-8px_rgb(255_180_0/0.6)] active:shadow-[0_2px_0_#B37E00]',
  board: 'bg-board-2 text-white shadow-[0_5px_0_#0B0C12] active:shadow-[0_1px_0_#0B0C12]',
  light: 'bg-paper text-ink ring-2 ring-ink/10 shadow-[0_5px_0_var(--color-concrete-2)] active:shadow-[0_1px_0_var(--color-concrete-2)]',
  pitch: 'bg-pitch text-white shadow-[0_6px_0_#06642F] active:shadow-[0_2px_0_#06642F]',
}

const SIZES = {
  md: 'h-12 px-5 text-lg rounded-xl gap-2',
  lg: 'h-16 px-7 text-2xl rounded-2xl gap-3',
  xl: 'h-20 px-10 text-3xl rounded-2xl gap-3',
}

/** Chunky stadium button: pressing sinks it onto its own base. */
export function Button({ variant = 'led', size = 'lg', className = '', children, disabled, ...rest }) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 4, scale: 0.98 }}
      transition={pop}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-display font-extrabold tracking-wide uppercase select-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

export function LangToggle({ tone = 'dark', className = '' }) {
  const { lang, setLang, t } = useLang()
  const base = tone === 'dark' ? 'bg-board-2 text-board-text' : 'bg-paper text-ink-2 ring-1 ring-ink/10'
  return (
    <div role="group" aria-label={t('lang.label')} className={`inline-flex items-center gap-1 rounded-full p-1 ${base} ${className}`}>
      <Languages className="ml-1.5 size-4 opacity-70" aria-hidden="true" />
      {['vi', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`relative h-8 min-w-11 rounded-full px-3 font-display text-base font-extrabold uppercase transition-colors ${
            lang === code ? 'text-ink' : tone === 'dark' ? 'hover:text-white' : 'hover:text-ink'
          }`}
        >
          {lang === code && <motion.span layoutId={`lang-pill-${tone}`} transition={pop} className="absolute inset-0 rounded-full bg-led" />}
          <span className="relative">{code}</span>
        </button>
      ))}
    </div>
  )
}

/** Authored jersey silhouette with the team's number. */
export function Jersey({ kit, number, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M34 8 L18 14 L4 32 L16 44 L24 38 L24 94 L76 94 L76 38 L84 44 L96 32 L82 14 L66 8 C62 16 56 20 50 20 C44 20 38 16 34 8 Z"
        fill={kit.bg}
        stroke="rgb(0 0 0 / 0.18)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M34 8 C38 16 44 20 50 20 C56 20 62 16 66 8" fill="none" stroke={kit.fg} strokeOpacity="0.5" strokeWidth="3" />
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontFamily="Big Shoulders Display, sans-serif"
        fontWeight="900"
        fontSize="40"
        fill={kit.fg}
      >
        {number}
      </text>
    </svg>
  )
}

export function BoardLabel({ children, className = '' }) {
  return <span className={`font-display text-sm font-extrabold tracking-[0.18em] text-board-text uppercase ${className}`}>{children}</span>
}
