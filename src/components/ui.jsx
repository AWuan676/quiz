import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'
import { Blob } from './Lobe.jsx'

const VARIANTS = {
  land: 'bg-land text-ink hover:bg-land-2',
  sun: 'bg-sun text-ink',
  coral: 'bg-coral text-ink',
  pond: 'bg-pond text-ink',
  ink: 'bg-ink text-water',
  outline: 'bg-transparent text-ink ring-2 ring-inset ring-ink hover:bg-ink/5',
}

const SIZES = {
  md: { btn: 'h-12 pl-5 text-base gap-3', pad: 'pr-5', chipPad: 'pr-1.5', chip: 'size-9', icon: 'size-4' },
  lg: { btn: 'h-16 pl-7 text-lg gap-4', pad: 'pr-7', chipPad: 'pr-2', chip: 'size-12', icon: 'size-5' },
  xl: { btn: 'h-20 pl-9 text-2xl gap-5', pad: 'pr-9', chipPad: 'pr-2.5', chip: 'size-15', icon: 'size-6' },
}

/**
 * Capsule control. `chip` adds the round arrow chip riding the trailing edge;
 * on hover/press it rolls forward.
 */
export function Button({ variant = 'land', size = 'lg', chip = false, className = '', children, disabled, ...rest }) {
  const s = SIZES[size]
  const chipTone = variant === 'ink' ? 'bg-water text-ink' : 'bg-ink text-water'
  return (
    <motion.button
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={pop}
      disabled={disabled}
      className={`group inline-flex items-center justify-between rounded-full font-semibold tracking-[-0.01em] uppercase select-none transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${VARIANTS[variant]} ${s.btn} ${chip ? s.chipPad : s.pad} ${className}`}
      {...rest}
    >
      <span className="inline-flex items-center gap-3">{children}</span>
      {chip && (
        <motion.span variants={{ hover: { x: 4 } }} transition={pop} className={`grid shrink-0 place-items-center rounded-full ${chipTone} ${s.chip}`}>
          <ArrowRight className={s.icon} aria-hidden="true" />
        </motion.span>
      )}
    </motion.button>
  )
}

export function LangToggle({ className = '' }) {
  const { lang, setLang, t } = useLang()
  return (
    <div role="group" aria-label={t('lang.label')} className={`inline-flex items-center rounded-full p-1 ring-2 ring-inset ring-ink ${className}`}>
      {['vi', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className="relative h-8 min-w-11 rounded-full px-3 text-sm font-semibold uppercase"
        >
          {lang === code && <motion.span layoutId="lang-pill" transition={pop} className="absolute inset-0 rounded-full bg-ink" />}
          <span className={`relative ${lang === code ? 'text-water' : 'text-ink'}`}>{code}</span>
        </button>
      ))}
    </div>
  )
}

/** A team on the map: a flat colour area with its number. */
export function TeamBlob({ kit, number, className = 'size-14', textClass = 'text-xl' }) {
  return (
    <Blob variant={number - 1} color={kit.bg} className={className}>
      <span className={`display tabular ${textClass}`} style={{ color: kit.fg }}>
        {number}
      </span>
    </Blob>
  )
}

/** Small uppercase label for a value. */
export function Label({ children, className = '' }) {
  return <span className={`text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase ${className}`}>{children}</span>
}

export function Brand({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Blob variant={2} color="var(--color-land)" className="size-9" />
      <span className="display text-xl">Quizmap</span>
    </span>
  )
}
