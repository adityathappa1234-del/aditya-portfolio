import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollHide } from '@/hooks/useScrollHide'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { scrollToSection, scrollToTop } from '@/hooks/useSmoothScroll'
import { navItems, personalInfo } from '@/data/portfolio'
import { EASE } from '@/animations/gsap'
import { cn } from '@/utils/cn'

/** Compact inline icons for the mobile dock. */
function NavIcon({ label }: { label: string }) {
  const common = {
    className: 'h-5 w-5',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (label) {
    case 'Home':
      return <svg {...common}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10V20h13V10" /></svg>
    case 'About':
      return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></svg>
    case 'Experience':
      return <svg {...common}><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" /><path d="M3 13h18" /></svg>
    case 'Projects':
      return <svg {...common}><path d="M3 8.5 12 4l9 4.5-9 4.5z" /><path d="m3 15 9 4.5L21 15" /></svg>
    case 'Skills':
      return <svg {...common}><path d="m9 8-5 4 5 4" /><path d="m15 8 5 4-5 4" /></svg>
    case 'Education':
      return <svg {...common}><path d="M3 9.5 12 5l9 4.5-9 4.5z" /><path d="M7 12v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V12" /></svg>
    case 'Contact':
      return <svg {...common}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
    default:
      return null
  }
}

export function Navigation() {
  const isVisible = useScrollHide()
  const { activeSection } = useScrollProgress()
  const [scrolled, setScrolled] = useState(false)

  // Shrink-on-scroll: the bar loses padding and gains a backdrop past 40px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ---------------- Desktop: top bar, shrinks + hides on scroll ------- */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 hidden md:block"
      >
        <div
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-500',
            scrolled ? 'py-3' : 'py-6'
          )}
        >
          {/* Monogram */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className={cn(
              'flex items-center justify-center rounded-control bg-gradient-to-br from-accent to-accent-2 font-display font-bold text-white shadow-lg shadow-accent/25 transition-all duration-500',
              scrolled ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm'
            )}
            aria-label="Back to top"
          >
            AK
          </motion.button>

          {/* Links with animated underline */}
          <nav
            className={cn(
              'flex items-center rounded-panel transition-all duration-500',
              scrolled
                ? 'panel gap-1 px-2 py-1.5'
                : 'gap-2 border border-transparent px-0 py-0'
            )}
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const active = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'group relative rounded-chip px-3 py-2 text-sm font-medium transition-colors duration-300',
                    active ? 'text-ink' : 'text-faint hover:text-ink'
                  )}
                  aria-current={active ? 'true' : undefined}
                >
                  {item.label}

                  {/* Hover underline: wipes in from the left. */}
                  <span className="pointer-events-none absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2 transition-transform duration-300 group-hover:scale-x-100" />

                  {/* Active pill — layoutId lets it slide between items. */}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-chip bg-accent/10 ring-1 ring-accent/25"
                      transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* CTA */}
          <motion.a
            href={`mailto:${personalInfo.email}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'rounded-control bg-ink font-medium text-bg transition-all duration-500 hover:opacity-90',
              scrolled ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm'
            )}
          >
            Get in touch
          </motion.a>
        </div>
      </motion.header>

      {/* ---------------- Mobile: bottom icon dock ------------------------- */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden"
            aria-label="Main navigation"
          >
            <div className="panel flex items-center gap-0.5 rounded-panel px-2 py-2">
              {navItems.map((item) => {
                const active = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-chip transition-colors duration-300',
                      active ? 'text-white' : 'text-faint'
                    )}
                    aria-label={`Go to ${item.label}`}
                    aria-current={active ? 'true' : undefined}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-mobile"
                        className="absolute inset-0 rounded-chip bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/30"
                        transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                      />
                    )}
                    <span className="relative z-10">
                      <NavIcon label={item.label} />
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
