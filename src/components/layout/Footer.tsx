import { motion } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'
import { personalInfo } from '@/data/portfolio'
import { scrollToTop } from '@/hooks/useSmoothScroll'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg-elevated/40 backdrop-blur-sm">
      {/* Extra bottom padding on mobile clears the fixed bottom nav dock. */}
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-24 sm:px-6 sm:pt-12 md:pb-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-control bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-white">
              AK
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{personalInfo.name}</p>
              <p className="font-mono text-[11px] text-faint">{personalInfo.headline}</p>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted" aria-label="Social links">
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="transition-colors hover:text-accent"
            >
              Email
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <p className="font-mono text-[11px] text-faint">
              © {new Date().getFullYear()} Built with precision.
            </p>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.94 }}
              className="panel flex h-10 w-10 items-center justify-center rounded-control text-muted transition-colors hover:text-accent"
              aria-label="Back to top"
            >
              <FiArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
