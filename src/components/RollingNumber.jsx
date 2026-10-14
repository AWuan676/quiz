import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

/** Scores roll up like a mechanical counter instead of jumping. */
export default function RollingNumber({ value, className = '', duration = 1.1 }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString('en-US'))
  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [mv, value, duration])
  return <motion.span className={`tabular ${className}`}>{text}</motion.span>
}
