import { CheckCircle2, Loader2, XCircle } from 'lucide-react'

export type Step = {
  step: number
  total: number
  label: string
  tech: string[]
  status: 'running' | 'done' | 'error'
  detail?: string | null
}

export default function StepList({ steps }: { steps: Step[] }) {
  if (steps.length === 0) return null

  return (
    <ul className="mt-4 space-y-3">
      {steps.map((s) => (
        <li key={s.step} className="flex items-start gap-3">
          {s.status === 'running' && (
            <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin text-text-dim" />
          )}
          {s.status === 'done' && <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />}
          {s.status === 'error' && <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" />}
          <div>
            <p className="text-sm font-medium text-text-h">{s.label}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {s.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] text-accent"
                >
                  {t}
                </span>
              ))}
            </div>
            {s.detail && <p className="mt-1 text-xs text-text-dim">{s.detail}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
