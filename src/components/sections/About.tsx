import { motion } from 'framer-motion'
import { aboutCards } from '@/data/portfolio'
import { DepthSection } from '@/components/ui/DepthSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cardIn, staggerContainer } from '@/animations/variants'

export function About() {
  return (
    <section id="about" className="relative z-10 px-5 py-14 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <DepthSection className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About"
          title="More about me"
          description="A passionate developer who believes in crafting experiences that leave a lasting impression."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="perspective-1000 grid gap-5 sm:grid-cols-2 sm:gap-6"
        >
          {aboutCards.map((card) => (
            <motion.article
              key={card.title}
              variants={cardIn}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35 }}
              className="panel gradient-border group relative overflow-hidden rounded-card p-6 sm:p-8"
              data-cursor="card"
            >
              {/* Tint that blooms in on hover. */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.07] via-transparent to-accent-3/[0.07] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.12, rotate: -6 }}
                  transition={{ duration: 0.3 }}
                  className="mb-5 inline-flex h-12 w-12 sm:mb-6 sm:h-14 sm:w-14 items-center justify-center rounded-panel bg-gradient-to-br from-accent/15 to-accent-2/15 text-2xl"
                >
                  {card.icon}
                </motion.div>

                <h3 className="mb-3 text-xl font-semibold text-ink">{card.title}</h3>
                <p className="text-base leading-relaxed text-muted">{card.description}</p>

                {/* Accent rule that draws out on hover. */}
                <div className="mt-5 h-0.5 w-0 sm:mt-6 rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500 group-hover:w-16" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </DepthSection>
    </section>
  )
}
