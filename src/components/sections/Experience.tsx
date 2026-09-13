import { useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiMapPin, FiCalendar } from 'react-icons/fi'
import { experience } from '@/data/portfolio'
import { DepthSection } from '@/components/ui/DepthSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { gsap, EASE, refreshScrollTriggers } from '@/animations/gsap'
import { cardIn, staggerContainer } from '@/animations/variants'

export function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const railRef = useRef<HTMLDivElement>(null)

  // The timeline rail draws itself as you scroll through the section.
  // scaleY is scrubbed, so scrolling back up retracts it again.
  useLayoutEffect(() => {
    const el = railRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          }
        )
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(el, { scaleY: 1 })
      })

      return () => mm.revert()
    })

    return () => ctx.revert()
  }, [])

  const toggle = (i: number) => {
    setExpandedIndex((prev) => (prev === i ? null : i))
  }

  return (
    <section id="experience" className="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
      <DepthSection className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've worked"
          description="My professional journey building products that make a difference."
        />

        <div className="relative">
          {/* Rail track + scrubbed fill */}
          <div className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-line-strong">
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3"
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="perspective-1000 space-y-6"
          >
            {experience.map((exp, i) => {
              const open = expandedIndex === i
              return (
                <motion.div key={`${exp.company}-${i}`} variants={cardIn} className="relative pl-12">
                  {/* Node */}
                  <div className="absolute left-[12px] top-6 z-10">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, type: 'spring', stiffness: 240, damping: 18 }}
                      className="block h-4 w-4 rounded-full border-2 border-accent bg-bg"
                    >
                      <span className="absolute inset-1 rounded-full bg-gradient-to-r from-accent to-accent-2" />
                    </motion.span>
                  </div>

                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3 }}
                    className="panel gradient-border overflow-hidden rounded-card"
                  >
                    <button
                      onClick={() => toggle(i)}
                      aria-expanded={open}
                      className="flex w-full items-start justify-between gap-4 p-6 text-left"
                    >
                      <div className="min-w-0 space-y-1.5">
                        <h3 className="text-lg font-semibold text-ink">{exp.role}</h3>
                        <p className="font-medium text-accent">{exp.company}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-faint">
                          <span className="flex items-center gap-1.5">
                            <FiCalendar className="h-3.5 w-3.5" />
                            {exp.duration}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1.5">
                            <FiMapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </span>
                        </div>
                      </div>

                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-chip bg-surface-2 text-muted"
                      >
                        <FiChevronDown className="h-5 w-5" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          // Document height just changed -> ScrollTrigger's cached
                          // start/end values for every section below are stale.
                          onAnimationComplete={refreshScrollTriggers}
                          className="overflow-hidden"
                        >
                          <div className="space-y-5 border-t border-line px-6 py-6">
                            <ul className="space-y-3">
                              {exp.achievements.map((achievement, j) => (
                                <motion.li
                                  key={j}
                                  initial={{ opacity: 0, x: -16 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.08 + j * 0.07, duration: 0.4, ease: EASE }}
                                  className="flex items-start gap-3 text-sm leading-relaxed text-muted"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-accent to-accent-2" />
                                  {achievement}
                                </motion.li>
                              ))}
                            </ul>

                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map((tech, j) => (
                                <motion.span
                                  key={tech}
                                  initial={{ opacity: 0, scale: 0.85 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.2 + j * 0.04, duration: 0.3 }}
                                  className="rounded-chip border border-accent/20 bg-accent/10 px-3 py-1 font-mono text-[11px] font-medium text-accent"
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </DepthSection>
    </section>
  )
}
