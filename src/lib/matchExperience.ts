import { experience, type ExperienceProject, type ExperienceRole } from '../content'

export type MatchedExperience = {
  role: ExperienceRole
  projects: ExperienceProject[]
}

/**
 * Finds resume roles relevant to a chunk of chat text — either because a specific
 * project is named (e.g. "Smart Design Failure Mode and Effects Analysis Platform"),
 * or because both the company and title are mentioned (e.g. "Senior Software Engineer at Ford").
 * Project-name matches only surface that project; role-only matches surface all of it.
 */
export function detectExperienceRoles(text: string): MatchedExperience[] {
  if (!text) return []
  const lower = text.toLowerCase()
  const matches: MatchedExperience[] = []

  for (const role of experience) {
    const matchedProjects = role.projects.filter((p) => lower.includes(p.name.toLowerCase()))
    const company = role.company.split(' ')[0].toLowerCase()
    const roleHit = lower.includes(company) && lower.includes(role.title.toLowerCase())

    if (matchedProjects.length > 0) {
      matches.push({ role, projects: matchedProjects })
    } else if (roleHit) {
      matches.push({ role, projects: role.projects })
    }
  }

  return matches
}
