/** Parses the "## Skills" section of RESUME.md into { category, items }[]. */
export function parseSkillsFromMarkdown(markdown: string): { category: string; items: string[] }[] {
  const sectionMatch = markdown.match(/## Skills\n([\s\S]*?)(?:\n## |$)/)
  if (!sectionMatch) return []

  const section = sectionMatch[1]
  const blocks = section.split(/^### /m).filter((b) => b.trim())

  return blocks.map((block) => {
    const lines = block.trim().split('\n')
    const category = lines[0].trim()
    const items = lines
      .slice(1)
      .join(' ')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    return { category, items }
  })
}
