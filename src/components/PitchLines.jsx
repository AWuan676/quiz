/** Painted pitch markings, stretched behind a screen. */
export default function PitchLines({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <g fill="none" stroke="var(--color-chalk)" strokeOpacity="0.4" strokeWidth="5">
        <rect x="40" y="40" width="1120" height="720" />
        <line x1="600" y1="40" x2="600" y2="760" />
        <circle cx="600" cy="400" r="110" />
        <rect x="40" y="220" width="170" height="360" />
        <rect x="990" y="220" width="170" height="360" />
        <rect x="40" y="320" width="60" height="160" />
        <rect x="1100" y="320" width="60" height="160" />
        <path d="M210 330 A 90 90 0 0 1 210 470" />
        <path d="M990 330 A 90 90 0 0 0 990 470" />
      </g>
      <circle cx="600" cy="400" r="6" fill="var(--color-chalk)" fillOpacity="0.5" />
    </svg>
  )
}
