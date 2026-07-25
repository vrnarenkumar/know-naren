import { FileText, Loader2, Sparkles, Upload } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import Section from './Section'
import StepList, { type Step } from './demos/StepList'
import { API_URL } from '../lib/api'
import { streamNDJSON } from '../lib/ndjson'

function mergeStep(prev: Step[], evt: Step): Step[] {
  const next = [...prev]
  const idx = next.findIndex((s) => s.step === evt.step)
  if (idx >= 0) next[idx] = evt
  else next.push(evt)
  return next
}

function renderAnalysis(markdown: string): ReactNode[] {
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
        <h4 key={i} className="mt-5 text-sm font-semibold text-text-h first:mt-0">
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

export default function JobMatch() {
  const [file, setFile] = useState<File | null>(null)
  const [jdText, setJdText] = useState('')
  const [steps, setSteps] = useState<Step[]>([])
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const canRun = (!!file || jdText.trim().length > 0) && !running && !!API_URL

  const run = async () => {
    if (!canRun) return
    setSteps([])
    setAnalysis(null)
    setError(null)
    setRunning(true)
    try {
      const form = new FormData()
      if (jdText.trim()) form.append('jd_text', jdText.trim())
      if (file) form.append('jd_file', file)

      for await (const evt of streamNDJSON(`${API_URL}/jd-match/match`, { method: 'POST', body: form })) {
        if (evt.type === 'error') {
          setError(evt.message as string)
        } else if (evt.type === 'result') {
          setAnalysis(evt.analysis as string)
        } else {
          const step = evt as unknown as Step
          setSteps((prev) => mergeStep(prev, step))
          if (step.status === 'error') setError(step.detail ?? 'Something went wrong.')
        }
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not reach the demo server. It may be waking up — try again in a moment.',
      )
    } finally {
      setRunning(false)
    }
  }

  return (
    <Section id="jd-match" title="JD Match" eyebrow="Recruiter Tool">
      <p className="mb-8 max-w-2xl text-text-dim">
        Upload a job description or paste it in — I'll compare it against my profile and show you why I'm a fit.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="gradient-border flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center transition-colors hover:border-accent">
          {file ? <FileText size={24} className="text-accent" /> : <Upload size={24} className="text-text-dim" />}
          <span className="text-sm text-text-dim">{file ? file.name : 'Click to upload a JD PDF'}</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="gradient-border rounded-xl border border-border bg-surface p-2">
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="...or paste the job description text here"
            rows={6}
            className="h-full w-full resize-none rounded-lg bg-transparent p-3 text-sm text-text placeholder:text-text-dim focus:outline-none"
          />
        </div>
      </div>

      {!API_URL && (
        <p className="mt-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-text-dim">
          Demo server isn't configured yet.
        </p>
      )}

      <button
        type="button"
        onClick={run}
        disabled={!canRun}
        className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {running ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {running ? 'Checking…' : 'Check Match'}
      </button>

      {running && steps.length === 0 && (
        <p className="mt-3 text-xs text-text-dim">Waking up the demo server — first request can take up to a minute…</p>
      )}

      <StepList steps={steps} />

      {error && (
        <p className="mt-4 max-w-2xl rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {analysis && (
        <div className="mt-6 max-w-2xl rounded-xl border border-border bg-surface-2 p-5">{renderAnalysis(analysis)}</div>
      )}
    </Section>
  )
}
