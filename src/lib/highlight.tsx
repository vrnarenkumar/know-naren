import type { ReactNode } from 'react'

const STOPWORDS = new Set([
  'a', 'an', 'the', 'do', 'does', 'did', 'have', 'has', 'had', 'you', 'your', 'i', 'is', 'are', 'was', 'were',
  'with', 'about', 'for', 'and', 'or', 'of', 'to', 'in', 'on', 'at', 'it', 'this', 'that', 'know', 'tell', 'me',
  'what', 'how', 'can', 'could', 'would', 'please', 'experience', 'work', 'worked',
])

function queryWords(query: string): string[] {
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/[^a-z0-9+#.]+/i)
        .filter((w) => w.length > 1 && !STOPWORDS.has(w)),
    ),
  )
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Wraps occurrences of the meaningful words from `query` inside `text` in a highlight mark. */
export function highlightMatches(text: string | null | undefined, query: string | null | undefined): ReactNode {
  if (!text) return text
  const words = query ? queryWords(query) : []
  if (words.length === 0) return text

  const pattern = new RegExp(`(${words.map((w) => `\\b${escapeRegExp(w)}\\b`).join('|')})`, 'gi')
  const parts = text.split(pattern)
  const wordSet = new Set(words)

  return parts.map((part, i) =>
    wordSet.has(part.toLowerCase()) ? (
      <mark key={i} className="rounded bg-accent/25 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
