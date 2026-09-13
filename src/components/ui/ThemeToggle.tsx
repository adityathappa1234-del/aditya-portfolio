import { motion, AnimatePresence } from 'framer-motion'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '@/hooks/useTheme'
import { EASE } from '@/animations/gsap'

/**
 * Fixed theme switch. The icon swap is a rotate + fade crossfade so the two
 * states never occupy the same visual space at full opacity.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: EASE }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      className="panel fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-control text-muted transition-colors hover:text-accent sm:right-6 sm:top-6"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="flex items-center justify-center"
        >
          {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
