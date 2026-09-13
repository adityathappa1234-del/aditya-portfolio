import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Custom two-part cursor: a fast dot and a lagging ring.
 *
 * Only mounts on devices with a fine pointer AND when motion is allowed —
 * hiding the native cursor is only safe if we are definitely drawing one.
 */
export function Cursor() {
  // NOTE: this is state, not a ref. A ref would be written during the effect
  // but never trigger a re-render, so the component would stay `null` forever
  // while `cursor: none` was already applied — an invisible cursor.
  const [enabled, setEnabled] = useState(false)
  const [hoverKind, setHoverKind] = useState<'none' | 'link' | 'card' | 'project'>('none')
  const reduced = usePrefersReducedMotion()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const dotX = useSpring(cursorX, { stiffness: 900, damping: 40, mass: 0.25 })
  const dotY = useSpring(cursorY, { stiffness: 900, damping: 40, mass: 0.25 })
  const ringX = useSpring(cursorX, { stiffness: 180, damping: 22, mass: 0.6 })
  const ringY = useSpring(cursorY, { stiffness: 180, damping: 22, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reduced)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t?.closest) return
      if (t.closest('[data-cursor="project"]')) setHoverKind('project')
      else if (t.closest('[data-cursor="card"]')) setHoverKind('card')
      else if (t.closest('a, button, [role="button"]')) setHoverKind('link')
      else setHoverKind('none')
    }

    document.body.style.cursor = 'none'
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.body.style.cursor = ''
    }
  }, [enabled, cursorX, cursorY])

  if (!enabled) return null

  const label = hoverKind === 'project' ? 'View' : ''
  const ringSize = hoverKind === 'none' ? 32 : hoverKind === 'link' ? 52 : 68

  return (
    <>
      {/* Lagging ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{ x: ringX, y: ringY }}
        aria-hidden="true"
      >
        <motion.div
          className="flex items-center justify-center rounded-full border border-accent/40 bg-accent/5 backdrop-blur-[2px]"
          animate={{
            width: ringSize,
            height: ringSize,
            x: -ringSize / 2,
            y: -ringSize / 2,
            opacity: hoverKind === 'none' ? 0.5 : 1,
          }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className="font-mono text-[9px] font-medium uppercase tracking-widest text-accent"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Leading dot — hidden while a label is showing so they don't overlap. */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ x: dotX, y: dotY }}
        aria-hidden="true"
      >
        <motion.div
          className="rounded-full bg-accent"
          animate={{
            width: hoverKind === 'none' ? 6 : 0,
            height: hoverKind === 'none' ? 6 : 0,
            x: hoverKind === 'none' ? -3 : 0,
            y: hoverKind === 'none' ? -3 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  )
}
