import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { FiArrowDown, FiDownload, FiLinkedin } from 'react-icons/fi'
import { HiOutlineMail } from 'react-icons/hi'
import { personalInfo } from '@/data/portfolio'
import { textReveal, textRevealContainer } from '@/animations/variants'
import { DepthSection } from '@/components/ui/DepthSection'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { scrollToSection } from '@/hooks/useSmoothScroll'
import { EASE } from '@/animations/gsap'

/** Positions are % of the card box — kept tight to its edges so the chips read
 *  as attached to the card rather than floating loose in the gutter. */
const techBadges = [
  { name: 'Angular', color: '#DD0031', top: '4%', left: '-6%' },
  { name: 'TypeScript', color: '#3178C6', top: '22%', left: '-11%' },
  { name: 'RxJS', color: '#E5177B', top: '70%', left: '-9%' },
  { name: 'SCSS', color: '#CF649A', top: '2%', left: '76%' },
  { name: 'HTML', color: '#E34F26', top: '46%', left: '84%' },
  { name: 'Git', color: '#F05032', top: '84%', left: '70%' },
]

/** Chips that drift around the hero card. Purely decorative. */
function FloatingBadge({
  name,
  color,
  top,
  left,
  index,
}: (typeof techBadges)[number] & { index: number }) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className="panel absolute z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1 }
          : {
              opacity: 1,
              scale: 1,
              // Gentle, de-synced drift so the cluster never pulses in unison.
              y: [0, -8 - (index % 3) * 3, 0],
            }
      }
      transition={{
        opacity: { delay: 0.9 + index * 0.08, duration: 0.5 },
        scale: { delay: 0.9 + index * 0.08, duration: 0.5, ease: EASE },
        y: { duration: 4 + index * 0.6, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-mono text-[10px] font-medium text-muted">{name}</span>
    </motion.div>
  )
}

/** Pointer-tilted stat card. Tilt lives in motion values — no re-renders. */
function InteractiveCard() {
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // TWEAK: the [8, -8] range is the max tilt in degrees.
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 22 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 22 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <div className="perspective-1000 relative">
      {techBadges.map((badge, i) => (
        <FloatingBadge key={badge.name} {...badge} index={i} />
      ))}

      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={() => {
          x.set(0)
          y.set(0)
        }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="panel gradient-border group relative rounded-card p-8"
        data-cursor="card"
      >
        {/* translateZ lifts inner content off the card face, so the tilt reads
            as real depth instead of a flat skew. */}
        <div style={{ transform: 'translateZ(40px)' }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-500">Available for work</span>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="gradient-text font-display text-5xl font-bold">1+</span>
              <span className="text-sm text-faint">years building</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Production Angular interfaces, shipped and maintained.
            </p>
          </div>

          <div className="space-y-2.5 border-t border-line pt-6">
            {['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Angular Material', 'Git'].map(
              (skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.07, duration: 0.4, ease: EASE }}
                  className="flex items-center gap-2.5"
                >
                  <span className="h-1 w-1 rounded-full bg-gradient-to-r from-accent to-accent-2" />
                  <span className="text-sm text-muted">{skill}</span>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  // Parallax for the ambient blobs — they drift slower than the page scrolls.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const blobY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])

  const nameChars = personalInfo.name.split('')

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 pb-14 sm:px-6 sm:pt-32 sm:pb-20 lg:px-8"
    >
      {/* Ambient parallax blobs */}
      <motion.div
        style={{ y: reduced ? 0 : blobY }}
        className="animate-morph pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] bg-gradient-to-br from-accent/20 via-accent-2/15 to-accent-3/10 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        style={{ y: reduced ? 0 : blobY2 }}
        className="animate-morph pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] bg-gradient-to-tr from-accent-3/15 via-accent-2/15 to-accent/10 blur-3xl"
        aria-hidden="true"
      />

      {/* mode="exit": the hero is already on screen at load, so it only needs
          the receding half of the depth effect. */}
      <DepthSection mode="exit" intensity={0.8} className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-12 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ---------------- Copy ---------------- */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
              className="panel inline-flex items-center gap-2 rounded-full px-4 py-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {personalInfo.location} · {personalInfo.headline}
              </span>
            </motion.div>

            <div className="space-y-4 sm:space-y-5">
              {/* Name: per-character mask reveal. Each char slides up from
                  behind an overflow-hidden line box. */}
              <motion.h1
                variants={textRevealContainer}
                initial="hidden"
                animate="visible"
                className="text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-ink"
              >
                <span className="block overflow-hidden pb-1">
                  {nameChars.map((char, i) => (
                    <motion.span
                      key={i}
                      variants={textReveal}
                      className="inline-block"
                      style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
                  className="gradient-text font-display text-2xl font-semibold sm:text-3xl"
                >
                  {personalInfo.tagline}
                </motion.p>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
                className="max-w-lg text-base leading-relaxed text-muted"
              >
                {personalInfo.bio}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5, ease: EASE }}
              className="flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                href={personalInfo.resumeUrl}
                download
                className="items-center gap-2 rounded-control bg-gradient-to-r from-accent to-accent-2 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-accent/30"
              >
                <FiDownload className="h-4 w-4" />
                Download Resume
              </MagneticButton>

              <MagneticButton
                href={`mailto:${personalInfo.email}`}
                className="panel items-center gap-2 rounded-control px-6 py-3.5 text-sm font-medium text-ink"
              >
                <HiOutlineMail className="h-4 w-4 text-accent" />
                Contact Me
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              {[
                { href: personalInfo.social.linkedin, label: 'LinkedIn', Icon: FiLinkedin },
              ].map(({ href, label, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  className="panel flex h-11 w-11 items-center justify-center rounded-control text-muted transition-colors hover:text-accent"
                  aria-label={`${label} profile`}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ---------------- Card ---------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
            className="hidden lg:block"
          >
            <InteractiveCard />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          onClick={() => scrollToSection('about')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          // Hidden on mobile, where the bottom nav dock occupies this space.
          className="mt-12 hidden items-center gap-3 text-faint transition-colors hover:text-accent sm:flex"
          aria-label="Scroll to about section"
        >
          <motion.span
            animate={reduced ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong"
          >
            <FiArrowDown className="h-4 w-4" />
          </motion.span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll</span>
        </motion.button>
      </DepthSection>
    </section>
  )
}
