import { colorForProject } from '../lib/projectColor'
import { highlightMatches } from '../lib/highlight'

export type MatchProject = { name: string; match_reason: string; keywords: string[] }

export default function MatchProjectCard({
  project,
  size = 'sm',
  query,
}: {
  project: MatchProject
  size?: 'sm' | 'plain'
  query?: string
}) {
  const color = colorForProject(project.name)

  if (size === 'plain') {
    return (
      <div>
        <p className="text-base font-semibold" style={{ color: color.base }}>
          {project.name}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text">{highlightMatches(project.match_reason, query)}</p>
        {project.keywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full border px-2.5 py-1 text-xs"
                style={{ borderColor: `${color.base}40`, color: color.base }}
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="rounded-lg border p-3"
      style={{ borderColor: `${color.base}4D`, backgroundColor: `${color.base}0D` }}
    >
      <p className="text-sm font-semibold" style={{ color: color.base }}>
        {project.name}
      </p>
      <p className="mt-1 text-sm text-text">{highlightMatches(project.match_reason, query)}</p>
      {project.keywords.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full border px-2 py-0.5 text-[11px]"
              style={{ borderColor: `${color.base}4D`, backgroundColor: `${color.base}1A`, color: color.base }}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
