import { motion } from 'framer-motion'
import { FiBookOpen, FiCalendar } from 'react-icons/fi'
import { education } from '@/data/portfolio'
import { DepthSection } from '@/components/ui/DepthSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cardIn, staggerContainer } from '@/animations/variants'

export function Education() {
  return (
    <section id="education" className="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
      <DepthSection className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Education"
          title="Academic background"
          description="The foundation that shaped my approach to problem-solving and technology."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="perspective-1000 space-y-6"
        >
          {education.map((edu) => (
            <motion.article
              key={edu.degree}
              variants={cardIn}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35 }}
              className="panel gradient-border group relative overflow-hidden rounded-card p-6 sm:p-8"
              data-cursor="card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex items-start gap-5">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -6 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-panel bg-gradient-to-br from-accent/15 to-accent-2/15 text-accent"
                >
                  <FiBookOpen className="h-6 w-6" />
                </motion.div>

                <div className="min-w-0 space-y-2">
                  <h3 className="text-lg font-semibold text-ink">{edu.degree}</h3>
                  <p className="font-medium text-accent">{edu.institution}</p>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-faint">
                    <FiCalendar className="h-3.5 w-3.5" />
                    {edu.duration}
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{edu.description}</p>
                  <div className="h-0.5 w-0 rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500 group-hover:w-16" />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </DepthSection>
    </section>
  )
}
