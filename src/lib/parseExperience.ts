export type ExperienceProject = {
  name: string
  bullets: string[]
}

export type ExperienceRole = {
  company: string
  title: string
  location: string
  dates: string
  projects: ExperienceProject[]
}

/** Parses the structured "## Experience" section in RESUME.md. */
export function parseExperienceFromMarkdown(markdown: string): ExperienceRole[] {
  const sectionMatch = markdown.match(/## Experience\n([\s\S]*?)(?:\n## |$)/)
  if (!sectionMatch) return []

  return sectionMatch[1]
    .split(/^### /m)
    .slice(1)
    .map((block) => {
      const lines = block.trim().split('\n')
      const header = lines.shift()?.trim() ?? ''
      const [title = '', companyLocation = '', dates = ''] = header.split(' — ').map((part) => part.trim())
      const lastComma = companyLocation.lastIndexOf(',')
      const company = lastComma === -1 ? companyLocation : companyLocation.slice(0, lastComma).trim()
      const location = lastComma === -1 ? '' : companyLocation.slice(lastComma + 1).trim()

      const projects: ExperienceProject[] = []
      let current: ExperienceProject | null = null

      for (const line of lines) {
        const projectHeader = line.match(/^\*\*(.+)\*\*$/)
        const bullet = line.match(/^- (.+)$/)
        if (projectHeader) {
          current = { name: projectHeader[1].trim(), bullets: [] }
          projects.push(current)
        } else if (bullet && current) {
          current.bullets.push(bullet[1].trim())
        }
      }

      return { company, title, location, dates, projects }
    })
    .filter((role) => role.title && role.projects.length > 0)
}
