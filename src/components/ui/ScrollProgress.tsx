import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { scrollToSection } from '@/hooks/useSmoothScroll'
import { navItems } from '@/data/portfolio'

/**
 * Left-edge progress rail with per-section markers.
 * The fill is driven with scaleY (a transform) rather than height, so it stays
 * on the compositor and never triggers layout during scroll.
 */
export function ScrollProgress() {
  const { progress, activeSection } = useScrollProgress()
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.id === activeSection)
  )

  return (
    <div className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
      <span className="font-mono text-[10px] tracking-widest text-faint">
        {String(Math.round(progress)).padStart(2, '0')}
      </span>

      <div className="relative h-36 w-px bg-line-strong">
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3"
          style={{ scaleY: progress / 100 }}
          transition={{ duration: 0.15, ease: 'linear' }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {navItems.map((item, i) => {
          const active = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group relative flex h-2 w-2 items-center justify-center"
              aria-label={`Go to ${item.label}`}
            >
              <motion.span
                className="block rounded-full"
                animate={{
                  width: active ? 8 : 5,
                  height: active ? 8 : 5,
                  backgroundColor:
                    active || i < activeIndex
                      ? 'var(--accent)'
                      : 'var(--line-strong)',
                }}
                transition={{ duration: 0.3 }}
              />
              <span className="panel pointer-events-none absolute left-5 whitespace-nowrap rounded-chip px-2 py-1 text-[10px] font-medium text-muted opacity-0 transition-all duration-200 group-hover:left-6 group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
