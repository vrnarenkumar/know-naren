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
    <ul className="space-y-3">
      {steps.map((s) => (
        <li key={s.step} className="flex items-start gap-2.5">
          {s.status === 'running' && (
            <Loader2 size={15} className="mt-0.5 shrink-0 animate-spin text-text-dim" />
          )}
          {s.status === 'done' && <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" />}
          {s.status === 'error' && <XCircle size={15} className="mt-0.5 shrink-0 text-red-400" />}
          <div className="min-w-0">
            <p className="text-[13px] font-medium leading-5 text-text-h">{s.label}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {(s.tech ?? []).map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] leading-4 text-text-dim"
                >
                  {t}
                </span>
              ))}
            </div>
            {s.detail && <p className="mt-1.5 break-words text-[12px] leading-5 text-text-dim">{s.detail}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
