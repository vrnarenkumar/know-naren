import { motion } from 'framer-motion'
import Section from './Section'
import { experience } from '../content'

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="relative space-y-12 border-l border-border pl-8">
        {experience.map((role, i) => (
          <motion.div
            key={`${role.company}-${role.title}`}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
            className="relative"
          >
            <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(139,92,246,0.7)]" />

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-semibold text-text-h">{role.title}</h3>
              <span className="text-sm text-text-dim">{role.dates}</span>
            </div>
            <p className="mb-4 text-sm text-accent">
              {role.company} · {role.location}
            </p>

            <div className="space-y-4">
              {role.projects.map((project) => (
                <div key={project.name || project.bullets[0]}>
                  {project.name && (
                    <h4 className="mb-1 text-sm font-semibold text-text-h">{project.name}</h4>
                  )}
                  <ul className="space-y-1.5">
                    {project.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-text">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
