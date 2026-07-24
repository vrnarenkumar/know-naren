import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import DemoModal from './DemoModal'
import StepList, { type Step } from './StepList'
import { streamNDJSON } from '../../lib/ndjson'

const API_URL = import.meta.env.VITE_DESCRIBE_AI_API_URL as string | undefined

type Result = { readme: string; owner: string | null; name: string | null }

function mergeStep(prev: Step[], evt: Step): Step[] {
  const next = [...prev]
  const idx = next.findIndex((s) => s.step === evt.step)
  if (idx >= 0) next[idx] = evt
  else next.push(evt)
  return next
}

export default function DescribeAiDemo({ onClose }: { onClose: () => void }) {
  const [repoUrl, setRepoUrl] = useState('')
  const [steps, setSteps] = useState<Step[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const run = async () => {
    if (!repoUrl.trim() || running || !API_URL) return
    setSteps([])
    setResult(null)
    setError(null)
    setRunning(true)
    try {
      for await (const evt of streamNDJSON(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl.trim() }),
      })) {
        if (evt.type === 'error') {
          setError(evt.message as string)
        } else if (evt.type === 'result') {
          setResult({ readme: evt.readme as string, owner: evt.owner as string, name: evt.name as string })
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

  const download = () => {
    if (!result?.readme) return
    const blob = new Blob([result.readme], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'README.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DemoModal
      title="describe-ai"
      subtitle="Analyze a public GitHub repo and generate its README — live."
      repoUrl="https://github.com/vrnarenkumar/describe-ai"
      accentColor={{ base: '#38bdf8', light: '#7dd3fc' }}
      howItWorks="A LangGraph pipeline does the work in three steps: (1) it clones the repo locally and reads the source files, prioritizing code over config and docs; (2) it sends the file tree and source to Llama 3.1 (via Groq) to produce a structured analysis of the purpose, architecture, and tech stack; (3) it feeds that analysis back to the model to write a complete README.md, following a standard template. This public demo only runs the analyze + generate steps — it does not open pull requests."
      onClose={onClose}
    >
      {!API_URL && (
        <p className="mb-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-text-dim">
          Demo server isn't configured yet.
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && run()}
        />
        <button
          type="button"
          onClick={run}
          disabled={running || !API_URL}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-black transition-opacity disabled:opacity-50"
        >
          {running && <Loader2 size={16} className="animate-spin" />}
          {running ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>

      {running && steps.length === 0 && (
        <p className="mt-3 text-xs text-text-dim">Waking up the demo server — first request can take up to a minute…</p>
      )}

      <StepList steps={steps} />

      {error && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>
      )}

      {result && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-h">Generated README.md</p>
            <button
              type="button"
              onClick={download}
              className="flex items-center gap-1.5 text-xs text-accent hover:underline"
            >
              <Download size={14} /> Download
            </button>
          </div>
          <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-border bg-surface-2 p-3 text-xs whitespace-pre-wrap text-text-dim">
            {result.readme}
          </pre>
        </div>
      )}
    </DemoModal>
  )
}
