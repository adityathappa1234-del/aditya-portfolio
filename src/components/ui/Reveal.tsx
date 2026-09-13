import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { EASE } from '@/animations/gsap'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds to wait before the reveal starts. */
  delay?: number
  /** Travel distance in px. Negative values come from above. */
  y?: number
  /** Replay every time it re-enters the viewport instead of only once. */
  repeat?: boolean
}

/**
 * One-shot entrance reveal for content *inside* a section.
 * Deliberately separate from <DepthSection>: this fires once and stays put,
 * while DepthSection is scrubbed and reverses with scroll. Layering a scrubbed
 * effect on top of a one-shot one is what makes scroll animation feel muddy,
 * so keep entrance polish here and depth choreography there.
 */
export function Reveal({ children, className, delay = 0, y = 24, repeat = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: !repeat, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
