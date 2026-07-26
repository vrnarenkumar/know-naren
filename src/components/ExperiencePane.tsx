import { motion, type Variants } from 'framer-motion'
import { colorForProject } from '../lib/projectColor'
import { highlightMatches, renderRichText } from '../lib/highlight'
import type { MatchedExperience } from '../lib/matchExperience'
import MatchProjectCard, { type MatchProject } from './MatchProjectCard'
import type { Project } from '../content'

export type ExperienceTurn = {
  id: string
  summary: string | null
  projects: MatchProject[] | null
  closing: string | null
  answer: string | null
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ExperiencePane({
  turn,
  matchedRoles,
  matchedPersonalProjects,
  query,
}: {
  turn: ExperienceTurn | null
  matchedRoles: MatchedExperience[]
  matchedPersonalProjects: Project[]
  query: string
}) {
  if (!turn) {
    return (
      <div className="flex h-full items-center px-8">
        <p className="text-sm leading-relaxed text-text-dim">
          Ask a question and I'll surface the relevant experience here.
        </p>
      </div>
    )
  }

  const backendProjects = turn.projects ?? []
  const highlight = turn.summary || turn.answer || turn.closing
  const hasClientMatches = matchedRoles.length > 0 || matchedPersonalProjects.length > 0

  return (
    <motion.div
      key={turn.id}
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col gap-8 overflow-y-auto px-8 py-8"
    >
      <motion.p variants={item} className="text-xs font-medium tracking-wide text-text-dim uppercase">
        Relevant experience
      </motion.p>

      {hasClientMatches ? (
        <div className="flex flex-col gap-8">
          {matchedRoles.map(({ role, projects: roleProjects }) => {
            const color = colorForProject(`${role.company}-${role.title}`)
            return (
              <motion.div
                key={`${role.company}-${role.title}`}
                variants={item}
                className="border-l-2 pl-4"
                style={{ borderColor: color.base }}
              >
                <p className="text-base font-semibold" style={{ color: color.base }}>
                  {role.title}
                </p>
                <p className="text-sm text-text-dim">
                  {role.company} · {role.dates}
                </p>
                <div className="mt-4 flex flex-col gap-4">
                  {roleProjects.map((p) => {
                    const projectColor = colorForProject(p.name)
                    return (
                      <div key={p.name}>
                        <p className="text-sm font-semibold" style={{ color: projectColor.base }}>
                          {p.name}
                        </p>
                        <ul className="mt-1.5 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-text">
                          {p.bullets.slice(0, 2).map((bullet, i) => (
                            <li key={i}>{highlightMatches(bullet, query)}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}

          {matchedPersonalProjects.length > 0 && (
            <motion.div variants={item} className="flex flex-col gap-4">
              {matchedRoles.length > 0 && (
                <p className="text-xs font-medium tracking-wide text-text-dim uppercase">Personal projects</p>
              )}
              {matchedPersonalProjects.map((proj) => {
                const color = proj.color ?? colorForProject(proj.name)
                return (
                  <div key={proj.name} className="border-l-2 pl-4" style={{ borderColor: color.base }}>
                    <p className="text-sm font-semibold" style={{ color: color.base }}>
                      {proj.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text">
                      {highlightMatches(proj.description, query)}
                    </p>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-block text-xs text-text-dim underline hover:text-text-h"
                      >
                        View project
                      </a>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>
      ) : backendProjects.length > 0 ? (
        <div className="flex flex-col gap-6">
          {backendProjects.map((p) => (
            <motion.div key={p.name} variants={item} className="border-b border-border/60 pb-6 last:border-0 last:pb-0">
              <MatchProjectCard project={p} size="plain" query={query} />
            </motion.div>
          ))}
        </div>
      ) : (
        highlight && (
          <motion.p variants={item} className="text-lg leading-relaxed text-text">
            {renderRichText(highlight, query)}
          </motion.p>
        )
      )}
    </motion.div>
  )
}
