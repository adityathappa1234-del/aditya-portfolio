import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '@/animations/gsap'

/**
 * Intro curtain. Runs ~1.2s, is skippable with any click/key/scroll, and only
 * shows once per session so repeat navigation is not slowed down.
 *
 * TWEAK: DURATION_MS controls how long it holds before lifting.
 */
const DURATION_MS = 1200

export function Loader({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      setLeaving(true)
      // Matches the exit transition below so the parent unmounts after the wipe.
      window.setTimeout(onDone, 600)
    }

    const timer = window.setTimeout(finish, DURATION_MS)

    // Skippable — an intro animation should never hold someone hostage.
    window.addEventListener('keydown', finish)
    window.addEventListener('click', finish)
    window.addEventListener('wheel', finish, { passive: true })
    window.addEventListener('touchstart', finish, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('click', finish)
      window.removeEventListener('wheel', finish)
      window.removeEventListener('touchstart', finish)
    }
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-bg"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotateX: 40 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-panel bg-gradient-to-br from-accent to-accent-2 font-display text-xl font-bold text-white shadow-2xl shadow-accent/40"
        >
          AK
        </motion.div>

        <div className="mx-auto h-px w-32 overflow-hidden bg-line-strong">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: DURATION_MS / 1000, ease: 'linear' }}
            className="h-full w-full origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-faint"
        >
          Click anywhere to skip
        </motion.p>
      </div>
    </motion.div>
  )
}
