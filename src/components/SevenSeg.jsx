const H = (x1, x2, y) => `${x1},${y} ${x1 + 5},${y - 5} ${x2 - 5},${y - 5} ${x2},${y} ${x2 - 5},${y + 5} ${x1 + 5},${y + 5}`
const V = (x, y1, y2) => `${x},${y1} ${x + 5},${y1 + 5} ${x + 5},${y2 - 5} ${x},${y2} ${x - 5},${y2 - 5} ${x - 5},${y1 + 5}`

const SEGMENTS = {
  a: H(10, 50, 6),
  b: V(54, 10, 48),
  c: V(54, 52, 90),
  d: H(10, 50, 94),
  e: V(6, 52, 90),
  f: V(6, 10, 48),
  g: H(10, 50, 50),
}

const MAP = {
  0: 'abcdef',
  1: 'bc',
  2: 'abged',
  3: 'abgcd',
  4: 'fgbc',
  5: 'afgcd',
  6: 'afgedc',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcdfg',
  '-': 'g',
  ' ': '',
}

function Digit({ char, dim }) {
  if (char === ':') {
    return (
      <svg viewBox="0 0 24 100" className="h-full w-auto" aria-hidden="true">
        <rect x="7" y="28" width="10" height="10" rx="2" transform="skewX(-6) translate(4 0)" />
        <rect x="7" y="64" width="10" height="10" rx="2" transform="skewX(-6) translate(8 0)" />
      </svg>
    )
  }
  const lit = MAP[char] ?? ''
  return (
    <svg viewBox="-4 0 70 100" className="h-full w-auto" aria-hidden="true">
      <g transform="translate(6 0) skewX(-6)">
        {Object.entries(SEGMENTS).map(([seg, points]) => (
          <polygon
            key={seg}
            points={points}
            style={{
              opacity: lit.includes(seg) ? 1 : dim,
              transition: 'opacity 120ms ease-out',
              filter: lit.includes(seg) ? 'drop-shadow(0 0 6px currentColor)' : 'none',
            }}
          />
        ))}
      </g>
    </svg>
  )
}

/**
 * LED seven-segment readout, drawn as SVG (never a font).
 * Height comes from className (e.g. "h-24"); colour from text-* (currentColor).
 */
export default function SevenSeg({ value, length, className = '', dim = 0.08, label }) {
  let text = String(value ?? '')
  if (length && text.length < length) text = text.padStart(length, ' ')
  return (
    <span role="img" aria-label={label ?? String(value)} className={`inline-flex items-stretch gap-[0.06em] fill-current ${className}`}>
      {[...text].map((ch, i) => (
        <Digit key={i} char={ch} dim={dim} />
      ))}
    </span>
  )
}
