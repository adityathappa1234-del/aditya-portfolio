import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiCopy, FiCheck, FiMapPin, FiArrowUpRight } from 'react-icons/fi'
import { HiOutlineMail } from 'react-icons/hi'
import { personalInfo } from '@/data/portfolio'
import { DepthSection } from '@/components/ui/DepthSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { fadeInUp, staggerContainer } from '@/animations/variants'

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email)
    } catch {
      // clipboard API needs a secure context; fall back to the legacy path.
      const textarea = document.createElement('textarea')
      textarea.value = personalInfo.email
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
      {/* intensity 1.15: the closing section gets the most pronounced arrival. */}
      <DepthSection intensity={1.15} className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let's work together"
          description="Have a project in mind? Let's create something worth shipping."
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="panel panel-sheen relative overflow-hidden rounded-card p-8 sm:p-12 lg:p-16"
        >
          <div
            className="animate-morph pointer-events-none absolute -right-24 -top-24 h-64 w-64 bg-gradient-to-br from-accent/20 to-accent-2/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="animate-morph pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 bg-gradient-to-tr from-accent-3/15 to-accent-2/10 blur-3xl"
            style={{ animationDelay: '6s' }}
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-8 text-center">
            <motion.p variants={fadeInUp} className="text-lg leading-relaxed text-muted">
              I'm always open to new opportunities, collaborations, and interesting problems.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <MagneticButton
                href={`mailto:${personalInfo.email}`}
                className="panel group items-center gap-3 rounded-control px-6 py-4 text-sm font-medium text-ink"
              >
                <HiOutlineMail className="h-5 w-5 text-accent" />
                <span className="break-all">{personalInfo.email}</span>
                <FiArrowUpRight className="h-4 w-4 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </MagneticButton>

              <MagneticButton
                onClick={copyEmail}
                aria-label="Copy email address"
                className="panel items-center gap-2 rounded-control px-5 py-4 text-sm font-medium text-muted"
              >
                {copied ? (
                  <>
                    <FiCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </MagneticButton>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 pt-2">
              {[
                { href: personalInfo.social.github, label: 'GitHub', Icon: FiGithub },
                { href: personalInfo.social.linkedin, label: 'LinkedIn', Icon: FiLinkedin },
              ].map(({ href, label, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.12, y: -4 }}
                  whileTap={{ scale: 0.94 }}
                  className="panel flex h-12 w-12 items-center justify-center rounded-control text-muted transition-colors hover:text-accent"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-2 font-mono text-xs text-faint"
            >
              <FiMapPin className="h-3.5 w-3.5" />
              <span>{personalInfo.location}</span>
            </motion.div>
          </div>
        </motion.div>
      </DepthSection>
    </section>
  )
}
