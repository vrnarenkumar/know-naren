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

const LINK_PATTERN = /(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
const TRAILING_PUNCT = /[.,;:!?)\]}]+$/

/** Like `highlightMatches`, but also turns URLs and email addresses into clickable links. */
export function renderRichText(text: string | null | undefined, query: string | null | undefined): ReactNode {
  if (!text) return text
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  const pattern = new RegExp(LINK_PATTERN)
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    const full = match[0]
    const isUrl = !!match[1]
    const start = match.index

    if (start > lastIndex) {
      nodes.push(<span key={key++}>{highlightMatches(text.slice(lastIndex, start), query)}</span>)
    }

    let display = full
    let trailing = ''
    if (isUrl) {
      const trimMatch = display.match(TRAILING_PUNCT)
      if (trimMatch) {
        trailing = trimMatch[0]
        display = display.slice(0, -trailing.length)
      }
    }

    nodes.push(
      <a
        key={key++}
        href={isUrl ? display : `mailto:${display}`}
        target={isUrl ? '_blank' : undefined}
        rel={isUrl ? 'noreferrer' : undefined}
        className="text-accent underline decoration-accent/50 underline-offset-2 hover:text-accent-2"
      >
        {display}
      </a>,
    )
    if (trailing) nodes.push(trailing)

    lastIndex = start + full.length
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{highlightMatches(text.slice(lastIndex), query)}</span>)
  }

  return nodes
}
