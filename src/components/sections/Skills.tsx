import { motion } from 'framer-motion'
import { skills } from '@/data/portfolio'
import { DepthSection } from '@/components/ui/DepthSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASE } from '@/animations/gsap'

/**
 * Proficiency bar.
 * The fill animates with scaleX rather than width: width would force a layout
 * pass on every frame, scaleX rides the compositor. The 1px-tall track is
 * given the visual height so the scaled child never blurs its own edges.
 */
function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: EASE }}
      className="group"
    >
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-ink transition-colors group-hover:text-accent">
          {name}
        </span>
        <span className="font-mono text-[11px] text-faint">{level}%</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: level / 100 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: 0.1 + index * 0.06, duration: 1, ease: EASE }}
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-accent via-accent-2 to-accent-3"
        />
      </div>
    </motion.div>
  )
}

/** Infinite marquee of every skill name — a calm, continuous accent band. */
function SkillTicker() {
  // Duplicated once so the -50% keyframe lands on an identical frame.
  const row = [...skills, ...skills]

  return (
    <div
      className="relative mt-16 overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max gap-10">
        {row.map((skill, i) => (
          <span
            key={`${skill.name}-${i}`}
            className="flex items-center gap-10 font-display text-sm font-medium tracking-wide text-faint"
          >
            {skill.name}
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
      <DepthSection className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills"
          title="What I work with"
          description="The frontend stack I use day to day."
        />

        <div className="panel rounded-card p-6 sm:p-8">
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            {skills.map((skill, i) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} index={i} />
            ))}
          </div>
        </div>

        <SkillTicker />
      </DepthSection>
    </section>
  )
}
