import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, PlayCircle, Sparkles } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import Section from './Section'
import DescribeAiDemo from './demos/DescribeAiDemo'
import NotebookAgentDemo from './demos/NotebookAgentDemo'
import { projects } from '../content'

const DEFAULT_COLOR = { base: '#ffffff', light: '#a3a3a3' }

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`
}

export default function Projects() {
  const [openDemo, setOpenDemo] = useState<'describe-ai' | 'notebook-agent' | null>(null)

  return (
    <Section id="projects" title="Featured Work" eyebrow="Personal Projects">
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => {
          const color = project.color ?? DEFAULT_COLOR
          const cardStyle = {
            '--card-accent': color.base,
            '--card-accent-2': color.light,
          } as CSSProperties

          return (
            <motion.div
              key={project.name}
              style={cardStyle}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="gradient-border group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${withAlpha(color.base, '26')}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                className="flex h-32 items-center justify-center border-b border-border bg-surface-2"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${withAlpha(color.base, '26')}, transparent 60%)`,
                }}
              >
                <Sparkles size={32} style={{ color: color.base }} className="transition-transform group-hover:scale-110" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-h">{project.name}</h3>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.name} on GitHub`}
                    className="text-text-dim transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = color.base)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="mb-4 text-sm text-text">{project.description}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-2.5 py-1 text-xs"
                      style={{
                        borderColor: withAlpha(color.base, '4D'),
                        backgroundColor: withAlpha(color.base, '1A'),
                        color: color.base,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.demo && (
                  <button
                    type="button"
                    onClick={() => setOpenDemo(project.demo!)}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                    style={{ background: `linear-gradient(90deg, ${color.base}, ${color.light})` }}
                  >
                    <PlayCircle size={16} /> Launch Live Demo
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {openDemo === 'describe-ai' && <DescribeAiDemo onClose={() => setOpenDemo(null)} />}
        {openDemo === 'notebook-agent' && <NotebookAgentDemo onClose={() => setOpenDemo(null)} />}
      </AnimatePresence>
    </Section>
  )
}
