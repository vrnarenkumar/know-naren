import type { ReactNode } from 'react'

/** Minimal renderer for the LLM's constrained markdown output (## headers, * bullets, paragraphs). */
export function renderAnalysis(markdown: string): ReactNode[] {
  const blocks: ReactNode[] = []
  let bullets: string[] = []

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return
    blocks.push(
      <ul key={key} className="ml-4 list-disc space-y-1.5 text-sm text-text">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>,
    )
    bullets = []
  }

  markdown.split('\n').forEach((line, i) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('## ')) {
      flushBullets(`ul-${i}`)
      blocks.push(
        <h4 key={i} className="mt-4 text-sm font-semibold text-text-h first:mt-0">
          {trimmed.slice(3)}
        </h4>,
      )
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      bullets.push(trimmed.slice(2))
    } else if (trimmed) {
      flushBullets(`ul-${i}`)
      blocks.push(
        <p key={i} className="mt-2 text-sm leading-relaxed text-text">
          {trimmed}
        </p>,
      )
    }
  })
  flushBullets('ul-end')
  return blocks
}
