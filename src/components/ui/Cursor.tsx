import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type HoverKind = 'none' | 'link' | 'card' | 'project'

/** Ring diameter per hover state. */
const RING_SIZE: Record<HoverKind, number> = {
  none: 30,
  link: 50,
  card: 66,
  project: 84,
}

const LABEL: Partial<Record<HoverKind, string>> = {
  project: 'View',
}

/**
 * Custom three-part cursor: a soft trailing glow, a rotating gradient ring and
 * a fast core dot.
 *
 * Only mounts on devices with a fine pointer AND when motion is allowed —
 * hiding the native cursor is only safe if we are definitely drawing one.
 */
export function Cursor() {
  // NOTE: this is state, not a ref. A ref would be written during the effect
  // but never trigger a re-render, so the component would stay `null` forever
  // while `cursor: none` was already applied — an invisible cursor.
  const [enabled, setEnabled] = useState(false)
  const [hoverKind, setHoverKind] = useState<HoverKind>('none')
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)
  const reduced = usePrefersReducedMotion()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Three lag profiles: the dot is near-instant, the ring trails it, and the
  // glow drifts well behind — that spread is what reads as weight.
  const dotX = useSpring(cursorX, { stiffness: 1400, damping: 55, mass: 0.16 })
  const dotY = useSpring(cursorY, { stiffness: 1400, damping: 55, mass: 0.16 })
  const ringX = useSpring(cursorX, { stiffness: 260, damping: 26, mass: 0.5 })
  const ringY = useSpring(cursorY, { stiffness: 260, damping: 26, mass: 0.5 })
  const glowX = useSpring(cursorX, { stiffness: 70, damping: 20, mass: 0.9 })
  const glowY = useSpring(cursorY, { stiffness: 70, damping: 20, mass: 0.9 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reduced)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setVisible(true)
    }

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t?.closest) return
      if (t.closest('[data-cursor="project"]')) setHoverKind('project')
      else if (t.closest('[data-cursor="card"]')) setHoverKind('card')
      else if (t.closest('a, button, [role="button"]')) setHoverKind('link')
      else setHoverKind('none')
    }

    const down = () => setPressed(true)
    const up = () => setPressed(false)
    // Leaving the window should take the drawn cursor with it, otherwise it
    // sits frozen at the edge while the real pointer is somewhere else.
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    document.documentElement.classList.add('has-custom-cursor')
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })
    window.addEventListener('mouseup', up, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
    }
  }, [enabled, cursorX, cursorY])

  if (!enabled) return null

  const label = LABEL[hoverKind]
  const size = RING_SIZE[hoverKind]
  const active = hoverKind !== 'none'
  const scale = pressed ? 0.82 : 1

  return (
    <>
      {/* ---- Trailing glow: the slowest layer, pure ambience ---- */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9997] hidden md:block"
        style={{ x: glowX, y: glowY }}
        aria-hidden="true"
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: active ? 240 : 170,
            height: active ? 240 : 170,
            x: active ? -120 : -85,
            y: active ? -120 : -85,
            opacity: visible ? (active ? 0.5 : 0.32) : 0,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--accent) 24%, transparent) 0%, transparent 68%)',
          }}
        />
      </motion.div>

      {/* ---- Rotating gradient ring ---- */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{ x: ringX, y: ringY }}
        aria-hidden="true"
      >
        <motion.div
          className="relative flex items-center justify-center rounded-full"
          animate={{
            width: size * scale,
            height: size * scale,
            x: (-size * scale) / 2,
            y: (-size * scale) / 2,
            opacity: visible ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* The gradient band. A radial mask punches out the middle so only a
              hairline border paints and the page shows through the centre. */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent))',
              WebkitMask:
                'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
              animation: 'cursorSpin 5s linear infinite',
              opacity: active ? 1 : 0.75,
            }}
          />

          {/* Faint tint inside the ring, stronger once something is hovered. */}
          <motion.span
            className="absolute inset-[1.5px] rounded-full bg-accent"
            animate={{ opacity: active ? 0.1 : 0.04 }}
            transition={{ duration: 0.3 }}
          />

          <AnimatePresence>
            {label && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="relative font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ---- Core dot: shrinks away while a label shows so they never overlap ---- */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ x: dotX, y: dotY }}
        aria-hidden="true"
      >
        <motion.div
          className="rounded-full bg-gradient-to-br from-accent to-accent-2"
          animate={{
            width: label ? 0 : active ? 5 : 7,
            height: label ? 0 : active ? 5 : 7,
            x: label ? 0 : active ? -2.5 : -3.5,
            y: label ? 0 : active ? -2.5 : -3.5,
            opacity: visible ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{ boxShadow: '0 0 12px var(--glow)' }}
        />
      </motion.div>
    </>
  )
}
