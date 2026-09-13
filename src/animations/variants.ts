import type { Variants } from 'framer-motion'

/** Shared easing. Matches the curve used by the GSAP scroll choreography. */
const ease = [0.25, 0.1, 0.25, 1] as const

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
}

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px)' },
  visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}

/** Parent container that staggers its direct children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

/** Tighter stagger for dense grids of small items (chips, badges). */
export const staggerTight: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

/** Per-character/word slide used by the hero headline mask reveal. */
export const textReveal: Variants = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 0.8, ease } },
}

export const textRevealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } },
}

/** Card entrance with a touch of 3D tilt, for use inside a perspective parent. */
export const cardIn: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 8 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease } },
}
