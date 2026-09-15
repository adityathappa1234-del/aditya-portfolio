import { motion } from 'framer-motion'
import { FiExternalLink, FiClock, FiUser } from 'react-icons/fi'
import { projects } from '@/data/portfolio'
import { DepthSection } from '@/components/ui/DepthSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASE } from '@/animations/gsap'

type Project = (typeof projects)[number]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasLive = Boolean(project.live && project.live !== '#')
  // URL() throws on anything malformed, so fall back to no host label rather
  // than taking the whole card down with it.
  let liveHost = ''
  if (hasLive) {
    try {
      liveHost = new URL(project.live as string).host.replace(/^www\./, '')
    } catch {
      liveHost = ''
    }
  }

  return (
    // Each card owns its own scroll-linked depth pass, and `offset` staggers
    // the start point so cards arrive one after another rather than together.
    <DepthSection intensity={0.9} offset={index * 4}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="panel gradient-border group space-y-4 rounded-card p-6 sm:space-y-5 sm:p-8 lg:p-9"
        data-cursor="project"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-accent to-accent-2" />
          <span className="eyebrow">Project {String(index + 1).padStart(2, '0')}</span>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{project.title}</h3>

        <p className="text-base leading-relaxed text-muted">{project.description}</p>

        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-faint">
          {project.role && (
            <span className="flex items-center gap-1.5">
              <FiUser className="h-3.5 w-3.5" />
              {project.role}
            </span>
          )}
          {project.duration && (
            <span className="flex items-center gap-1.5">
              <FiClock className="h-3.5 w-3.5" />
              {project.duration}
            </span>
          )}
        </div>

        {project.features?.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-chip border border-line bg-surface-2 px-3 py-1.5 font-mono text-[11px] font-medium text-muted transition-colors hover:border-accent/30 hover:text-accent"
            >
              {tech}
            </span>
          ))}
        </div>

        {hasLive && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, x: 3 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-control bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/25"
            >
              <FiExternalLink className="h-4 w-4" />
              Visit live site
            </motion.a>

            {/* The bare domain, so the destination is readable before clicking. */}
            <span className="font-mono text-xs text-faint">{liveHost}</span>
          </div>
        )}
      </motion.article>
    </DepthSection>
  )
}

export function Projects() {
  return (
    <section id="projects" className="relative z-10 px-5 py-14 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl">
        {/* Heading gets its own depth pass; the cards each get theirs, so a
            long section doesn't animate as one enormous block. */}
        <DepthSection mode="enter">
          <SectionHeading
            eyebrow="Projects"
            title="Things I've built"
            description="A few of the products I've worked on as a frontend developer."
          />
        </DepthSection>

        <div className="space-y-6 sm:space-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
