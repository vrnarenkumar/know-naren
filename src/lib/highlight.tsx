import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react'
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

function linkChipMeta(url: string, isEmail: boolean): { Icon: typeof Mail; label: string } {
  if (isEmail) return { Icon: Mail, label: 'Email' }
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host.includes('linkedin.com')) return { Icon: Linkedin, label: 'LinkedIn' }
    if (host.includes('github.com')) return { Icon: Github, label: 'GitHub' }
    return { Icon: ExternalLink, label: host }
  } catch {
    return { Icon: ExternalLink, label: url }
  }
}

/** Like `highlightMatches`, but also turns URLs and email addresses into small icon+label link chips. */
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

    const href = isUrl ? display : `mailto:${display}`
    const { Icon, label } = linkChipMeta(display, !isUrl)

    nodes.push(
      <a
        key={key++}
        href={href}
        target={isUrl ? '_blank' : undefined}
        rel={isUrl ? 'noreferrer' : undefined}
        title={display}
        className="mx-0.5 inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 align-middle text-xs font-medium text-accent transition-colors hover:bg-accent/20"
      >
        <Icon size={12} />
        {label}
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
