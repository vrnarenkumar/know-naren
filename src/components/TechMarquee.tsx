import { skills } from '../content'

const items = skills.flatMap((g) => g.items)
const loop = [...items, ...items]

export default function TechMarquee() {
  return (
    <div className="my-10 w-full overflow-hidden border-y border-border/60 bg-surface/40 py-4">
      <div className="animate-marquee flex w-max gap-3">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-text-dim"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
