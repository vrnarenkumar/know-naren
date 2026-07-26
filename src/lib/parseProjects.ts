export type ResumeProject = {
  name: string
  description: string
  tags: string[]
  link?: string
  demo?: 'describe-ai' | 'notebook-agent' | 'talk-to-data'
  color?: { base: string; light: string }
  /** Filenames under /public/projects/<name>/, e.g. "loss-accuracy.png" */
  images?: string[]
}

/** Parses the structured "## Personal Projects" section in RESUME.md. */
export function parseProjectsFromMarkdown(markdown: string): ResumeProject[] {
  const sectionMatch = markdown.match(/## Personal Projects\n([\s\S]*?)(?:\n## |$)/)
  if (!sectionMatch) return []

  // Ignore the copy-and-paste authoring template in the résumé.
  return sectionMatch[1]
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/^### /m)
    .slice(1)
    .map((block) => {
      const lines = block.trim().split('\n')
      const name = lines.shift()?.trim() ?? ''
      const fields = new Map<string, string>()
      const description: string[] = []

      for (const line of lines) {
        const field = line.match(/^- (Tags|Link|Demo|Color|Images):\s*(.+)$/i)
        if (field) fields.set(field[1].toLowerCase(), field[2].trim())
        else if (line.trim()) description.push(line.trim())
      }

      const colors = fields.get('color')?.split(',').map((value) => value.trim())
      const demo = fields.get('demo')
      const parsedDemo: ResumeProject['demo'] =
        demo === 'describe-ai'
          ? 'describe-ai'
          : demo === 'notebook-agent'
            ? 'notebook-agent'
            : demo === 'talk-to-data'
              ? 'talk-to-data'
              : undefined
      const images = fields
        .get('images')
        ?.split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      return {
        name,
        description: description.join(' '),
        tags: (fields.get('tags') ?? '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        link: fields.get('link'),
        ...(parsedDemo ? { demo: parsedDemo } : {}),
        ...(colors?.length === 2 ? { color: { base: colors[0], light: colors[1] } } : {}),
        ...(images?.length ? { images } : {}),
      }
    })
    .filter((project) => project.name && project.description)
}
