import { AnimatePresence, motion } from 'framer-motion'
import { Blob, CornerLobe } from './Lobe.jsx'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

// Each beat lands on its own area of the map. Not land/sun/coral: that run is reserved for draining time.
const BEATS = {
  3: { color: 'var(--color-pond)', variant: 0, tilt: -8 },
  2: { color: 'var(--color-lilac)', variant: 2, tilt: 6 },
  1: { color: 'var(--color-land)', variant: 1, tilt: -3 },
}

/**
 * "3, 2, 1" before question 1, on the projector and on every phone.
 * `leftMs` comes from the shared server clock, so all screens tick together.
 */
export default function Countdown({ leftMs, mode, total, big = false }) {
  const { t } = useLang()
  const n = Math.min(3, Math.max(1, Math.ceil(leftMs / 1000)))
  const beat = BEATS[n]
  const sub = mode === 'clues' ? t('countdown.clues') : t('countdown.standard')

  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-10 text-center">
      <CornerLobe corner="tr" className={`absolute -z-10 ${big ? '-top-[18vw] -right-[22vw] w-[52vw]' : '-top-[30vw] -right-[45vw] w-[100vw]'}`} />
      <CornerLobe
        corner="bl"
        color="var(--color-sun)"
        delay={0.1}
        className={`absolute -z-10 ${big ? '-bottom-[20vw] -left-[18vw] w-[38vw]' : '-bottom-[35vw] -left-[40vw] w-[80vw]'}`}
      />

      <div className={`relative grid place-items-center ${big ? 'size-[min(52vh,30rem)]' : 'size-64'}`} role="timer" aria-live="assertive" aria-label={t('countdown.aria', { n })}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={n}
            className="absolute inset-0 grid place-items-center"
            initial={{ scale: 0.3, rotate: beat.tilt - 30, opacity: 0 }}
            animate={{ scale: 1, rotate: beat.tilt, opacity: 1 }}
            exit={{ scale: 1.25, opacity: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
            transition={pop}
          >
            <Blob variant={beat.variant} color={beat.color} className="size-full">
              <span className={`display tabular block ${big ? 'text-[min(34vh,19rem)]' : 'text-[10rem]'}`} style={{ rotate: `${-beat.tilt}deg`, lineHeight: 1 }}>
                {n}
              </span>
            </Blob>
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...pop, delay: 0.15 }}
        className={`display mt-8 text-balance ${big ? 'text-[clamp(2.5rem,5vw,4.5rem)]' : 'text-4xl'}`}
      >
        {t('countdown.title', { n: total })}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...pop, delay: 0.25 }}
        className={`mt-3 max-w-md font-semibold text-ink-2 ${big ? 'text-2xl max-w-2xl' : 'text-lg'}`}
      >
        {sub}
      </motion.p>
    </div>
  )
}
