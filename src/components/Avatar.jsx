import { KITS } from '../lib/kits.js'
import { Blob } from './Lobe.jsx'

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?'

/** A player: their chosen colour as a blob, with their initials. */
export default function Avatar({ name, avatar = 0, variant, className = 'size-14', textClass = 'text-lg', dim = false }) {
  const kit = KITS[avatar % KITS.length]
  return (
    <Blob variant={variant ?? avatar} color={kit.bg} className={`${className} ${dim ? 'opacity-40' : ''}`}>
      <span className={`display ${textClass}`} style={{ color: kit.fg }}>
        {initials(name)}
      </span>
    </Blob>
  )
}
