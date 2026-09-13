import { motion } from 'framer-motion'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'
import { EASE } from '@/animations/gsap'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

/**
 * Shared section header so every section has identical rhythm:
 * eyebrow -> 16px -> title -> 16px -> description.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <div className={cn('mb-16', centered && 'text-center', className)}>
      <Reveal>
        <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
          {/* Rule that draws itself outward from the eyebrow label. */}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ transformOrigin: centered ? 'right' : 'left' }}
            className="h-px w-8 bg-gradient-to-r from-accent to-accent-2"
          />
          <span className="eyebrow">{eyebrow}</span>
          {centered && (
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ transformOrigin: 'left' }}
              className="h-px w-8 bg-gradient-to-l from-accent to-accent-2"
            />
          )}
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              'mt-4 max-w-2xl text-base leading-relaxed text-muted',
              centered && 'mx-auto'
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
