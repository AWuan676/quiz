import { motion } from 'framer-motion'

/** Organic blob outlines, centred in a -100..100 box. Used for team markers and small areas. */
export const BLOBS = [
  'M58,-62C73,-47,80,-24,79,-1C78,21,69,43,53,58C37,73,15,81,-8,80C-31,79,-55,70,-68,52C-81,34,-84,8,-77,-15C-70,-38,-53,-59,-32,-72C-11,-85,15,-91,33,-84C45,-79,50,-70,58,-62Z',
  'M47,-71C60,-60,68,-45,74,-29C80,-13,84,5,79,21C74,37,60,51,44,63C28,75,10,84,-9,83C-28,82,-48,71,-62,55C-76,39,-84,18,-83,-3C-82,-24,-72,-45,-57,-58C-42,-71,-22,-76,-3,-72C16,-68,34,-82,47,-71Z',
  'M62,-50C76,-34,80,-11,75,10C70,31,56,50,37,63C18,76,-6,83,-28,77C-50,71,-70,52,-78,29C-86,6,-82,-21,-68,-40C-54,-59,-30,-70,-6,-72C18,-74,48,-66,62,-50Z',
  'M38,-63C52,-58,68,-52,75,-39C82,-26,80,-7,74,9C68,25,58,39,45,52C32,65,16,77,-3,80C-22,83,-44,77,-58,63C-72,49,-78,27,-80,5C-82,-17,-80,-39,-67,-52C-54,-65,-30,-69,-10,-70C10,-71,24,-68,38,-63Z',
]

// A coastline that enters from the top-right corner and leaves the frame on two sides.
const COAST =
  'M1000,0 L1000,760 C930,820 820,800 760,730 C690,650 600,690 540,610 C470,520 560,440 500,350 C440,260 330,280 310,180 C295,100 350,40 400,0 Z'

const FLIP = {
  tr: '',
  tl: 'translate(1000 0) scale(-1 1)',
  br: 'translate(0 1000) scale(1 -1)',
  bl: 'translate(1000 1000) scale(-1 -1)',
}

const ORIGIN = { tr: 'top right', tl: 'top left', br: 'bottom right', bl: 'bottom left' }

/**
 * A land area swelling in from a corner. Size and position come from className
 * (e.g. "absolute -top-10 -right-10 w-[60vw]").
 */
export function CornerLobe({ corner = 'tr', color = 'var(--color-land)', className = '', delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 1000 1000"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ transformOrigin: ORIGIN[corner] }}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18, delay }}
    >
      <path d={COAST} fill={color} transform={FLIP[corner]} />
    </motion.svg>
  )
}

/** A single blob area; children are laid over it (e.g. a team number). */
export function Blob({ variant = 0, color, className = '', children, title }) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`} title={title}>
      <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={BLOBS[variant % BLOBS.length]} fill={color} />
      </svg>
      <span className="relative">{children}</span>
    </span>
  )
}
