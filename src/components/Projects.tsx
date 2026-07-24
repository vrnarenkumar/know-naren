import { motion } from 'framer-motion'
import { ExternalLink, Sparkles } from 'lucide-react'
import Section from './Section'
import { projects } from '../content'

export default function Projects() {
  return (
    <Section id="projects" title="Featured Work" eyebrow="Personal Projects">
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <motion.a
            key={project.name}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
            whileHover={{ y: -6 }}
            className="gradient-border group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <div className="bg-glow flex h-32 items-center justify-center border-b border-border bg-surface-2">
              <Sparkles size={32} className="text-accent transition-transform group-hover:scale-110" />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-h">{project.name}</h3>
                <ExternalLink
                  size={16}
                  className="text-text-dim transition-colors group-hover:text-accent"
                />
              </div>
              <p className="mb-4 text-sm text-text">{project.description}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  )
}
