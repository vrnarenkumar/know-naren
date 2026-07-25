const PALETTE = [
  { base: '#38bdf8', light: '#7dd3fc' }, // sky
  { base: '#a78bfa', light: '#c4b5fd' }, // violet
  { base: '#34d399', light: '#6ee7b7' }, // emerald
  { base: '#fbbf24', light: '#fcd34d' }, // amber
  { base: '#fb7185', light: '#fda4af' }, // rose
  { base: '#22d3ee', light: '#67e8f9' }, // cyan
]

/** Deterministically assigns one of a fixed palette of colors to a project name. */
export function colorForProject(name: string): { base: string; light: string } {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}
