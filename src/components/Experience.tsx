import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Section from './Section'
import { experience } from '../content'

export default function Experience() {
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  const role = selected !== null ? experience[selected] : null

  return (
    <Section id="experience" title="My Journey" eyebrow="Career Path">
      <p className="mb-10 text-sm text-text-dim">Click a role to see the projects.</p>

      <div className="overflow-x-auto pb-4">
        <div className="relative min-w-[640px] px-4">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
            className="absolute left-4 right-4 top-4 h-px bg-gradient-to-r from-accent via-accent-2 to-accent"
          />

          <div className="relative flex justify-between">
            {experience.map((r, i) => (
              <motion.button
                key={`${r.company}-${r.title}`}
                type="button"
                onClick={() => setSelected(i)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: 'easeOut' }}
                className="group flex w-32 flex-col items-center gap-3 text-center cursor-pointer"
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute h-4 w-4 animate-ping rounded-full bg-accent/50" />
                  <span className="relative h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_rgba(255,255,255,0.7)] ring-4 ring-bg transition-transform group-hover:scale-125" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text-h underline decoration-transparent underline-offset-4 transition-colors group-hover:text-accent group-hover:decoration-accent/50">
                    {r.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-accent">{r.company.split(' (')[0]}</span>
                  <span className="mt-0.5 block text-xs text-text-dim">{r.dates}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {role && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="h-1.5 shrink-0 bg-gradient-to-r from-accent to-accent-2" />
              <div className="flex shrink-0 items-start justify-between gap-4 p-6 pb-4">
                <div>
                  <h3 className="text-xl font-semibold text-text-h">{role.title}</h3>
                  <p className="text-sm text-accent">
                    {role.company} · {role.location}
                  </p>
                  <p className="mt-1 text-xs text-text-dim">{role.dates}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelected(null)}
                  className="text-text-dim transition-colors hover:text-text-h"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto px-6 pb-6">
                <ul className="space-y-5">
                  {role.projects.map((project) => (
                    <li key={project.name}>
                      <p className="mb-1.5 text-sm font-semibold text-text-h">{project.name}</p>
                      <ul className="space-y-1.5">
                        {project.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2 text-sm text-text-dim">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
