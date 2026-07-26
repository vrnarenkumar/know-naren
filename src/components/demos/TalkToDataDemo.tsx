import { Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import DemoModal from './DemoModal'
import StepList, { type Step } from './StepList'
import TalkToDataChart from './TalkToDataChart'
import { API_URL } from '../../lib/api'
import { streamNDJSON } from '../../lib/ndjson'

const SAMPLE_EXAMPLES = ['revenue per day', 'top 5 products by revenue', 'orders by status', 'total number of orders']
const CSV_EXAMPLES = ['describe the data', 'how many rows are there', 'give me a summary']
const MAX_CSV_BYTES = 5 * 1024 * 1024

type Dataset = { kind: 'sample' } | { kind: 'csv'; sessionId: string; filename: string; schema: string }

type ResultData = {
  type: 'result'
  name: string
  intent: string
  summary: string
  sql: string
  chart_type: string
  columns: string[]
  rows: Record<string, unknown>[]
}
type ClarifyData = { type: 'clarify'; message: string }
type ErrorData = { type: 'error'; message: string; sql?: string }
type AssistantData = ResultData | ClarifyData | ErrorData

type Message = { role: 'user'; text: string } | { role: 'assistant'; data: AssistantData }

// Contextual "what next" chips shown after each answer — related to the
// question just asked, not a static list, so the conversation keeps moving
// instead of only suggesting something at the very start.
function suggestFollowUps(last: ResultData): string[] {
  switch (last.intent) {
    case 'trend':
      return ['show the top 5 instead', 'break it down by category', 'as a bar chart']
    case 'ranking':
      return ['show this as a trend over time', 'as a pie chart']
    case 'comparison':
      return ['show this as a trend over time', 'as a bar chart']
    case 'aggregate':
      return ['break this down by month', 'as a bar chart']
    default:
      return ['show this as a trend over time', 'as a bar chart']
  }
}

function mergeStep(prev: Step[], evt: Step): Step[] {
  const next = [...prev]
  const idx = next.findIndex((s) => s.step === evt.step)
  // Merge rather than replace: a "done"/"error" event that omits a field
  // (e.g. `tech`) shouldn't wipe out what the earlier "running" event set.
  if (idx >= 0) next[idx] = { ...next[idx], ...evt }
  else next.push(evt)
  return next
}

function messageText(data: AssistantData): string {
  if (data.type === 'result') return data.summary || data.name
  return data.message
}

function AssistantMessage({ data }: { data: AssistantData }) {
  if (data.type === 'clarify' || data.type === 'error') {
    return (
      <div className="rounded-lg border border-border bg-surface-2 p-3">
        <p className={`text-sm ${data.type === 'error' ? 'text-red-400' : 'text-text'}`}>{data.message}</p>
        {data.type === 'error' && data.sql && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-text-dim">SQL</summary>
            <pre className="mt-1 overflow-x-auto rounded-md bg-surface p-2 text-[11px] text-text-dim">{data.sql}</pre>
          </details>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      {data.summary && <p className="text-sm text-text">{data.summary}</p>}
      <div className="mt-3">
        <TalkToDataChart chartType={data.chart_type} columns={data.columns} rows={data.rows} />
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-text-dim">SQL</summary>
        <pre className="mt-1 overflow-x-auto rounded-md bg-surface p-2 text-[11px] text-text-dim">{data.sql}</pre>
      </details>
    </div>
  )
}

function DatasetChoice({
  uploading,
  uploadSteps,
  uploadError,
  onUseSample,
  onPickFile,
}: {
  uploading: boolean
  uploadSteps: Step[]
  uploadError: string | null
  onUseSample: () => void
  onPickFile: (file: File) => void
}) {
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onUseSample}
        disabled={uploading}
        className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-left transition-colors hover:border-accent disabled:opacity-50"
      >
        <p className="text-sm font-medium text-text-h">Use the sample dataset</p>
        <p className="mt-0.5 text-xs text-text-dim">A small e-commerce DB — orders, customers, products.</p>
      </button>

      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-2 px-6 py-6 text-center transition-colors hover:border-accent ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <Upload size={20} className="text-text-dim" />
        <span className="text-sm text-text-dim">Or upload your own CSV (max 5MB)</span>
        <input
          ref={fileInput}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onPickFile(file)
            if (fileInput.current) fileInput.current.value = ''
          }}
        />
      </label>

      {uploading && (
        <div className="rounded-lg border border-border bg-surface-2 p-3">
          <StepList steps={uploadSteps} />
          {uploadSteps.length === 0 && (
            <p className="flex items-center gap-2 text-xs text-text-dim">
              <Loader2 size={14} className="animate-spin" /> Waking up the demo server — first request can take a
              moment…
            </p>
          )}
        </div>
      )}

      {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
    </div>
  )
}

export default function TalkToDataDemo({ onClose }: { onClose: () => void }) {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSteps, setUploadSteps] = useState<Step[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [steps, setSteps] = useState<Step[]>([])
  const [running, setRunning] = useState(false)

  const reset = () => {
    setDataset(null)
    setMessages([])
    setInput('')
    setSteps([])
    setUploadError(null)
  }

  const doUpload = async (file: File) => {
    if (!API_URL) return
    if (file.size > MAX_CSV_BYTES) {
      setUploadError('That file is too large for the demo (max 5MB).')
      return
    }
    setUploadError(null)
    setUploadSteps([])
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      for await (const evt of streamNDJSON(`${API_URL}/talk-to-data/upload`, { method: 'POST', body: form })) {
        if (evt.type === 'error') {
          setUploadError(evt.message as string)
        } else if (evt.type === 'result') {
          setDataset({
            kind: 'csv',
            sessionId: evt.session_id as string,
            filename: evt.filename as string,
            schema: evt.schema as string,
          })
        } else {
          setUploadSteps((prev) => mergeStep(prev, evt as unknown as Step))
        }
      }
    } catch (e) {
      setUploadError(
        e instanceof Error
          ? e.message
          : 'Could not reach the demo server. It may be waking up — try again in a moment.',
      )
    } finally {
      setUploading(false)
    }
  }

  const send = async (text?: string) => {
    const question = (text ?? input).trim()
    if (!question || running || !API_URL || !dataset) return

    const history = messages.map((m) =>
      m.role === 'user' ? { role: 'user', content: m.text } : { role: 'assistant', content: messageText(m.data) },
    )
    const sessionId = dataset.kind === 'csv' ? dataset.sessionId : null

    setMessages((m) => [...m, { role: 'user', text: question }])
    setInput('')
    setSteps([])
    setRunning(true)

    try {
      for await (const evt of streamNDJSON(`${API_URL}/talk-to-data/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history, session_id: sessionId }),
      })) {
        if (evt.type === 'result' || evt.type === 'clarify' || evt.type === 'error') {
          setMessages((m) => [...m, { role: 'assistant', data: evt as unknown as AssistantData }])
          setSteps([])
        } else {
          setSteps((prev) => mergeStep(prev, evt as unknown as Step))
        }
      }
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Could not reach the demo server. It may be waking up — try again in a moment.'
      setMessages((m) => [...m, { role: 'assistant', data: { type: 'error', message } }])
      setSteps([])
    } finally {
      setRunning(false)
    }
  }

  return (
    <DemoModal
      title="talk-to-your-data"
      subtitle="Ask a database questions in plain English — live SQL, a chart, and a summary."
      repoUrl="https://github.com/vrnarenkumar/talk-to-your-data"
      accentColor={{ base: '#34d399', light: '#6ee7b7' }}
      howItWorks="A staged NLP pipeline, not a multi-agent framework. NLU (rule-based) classifies the question's intent and links it to relevant tables/columns; NER (spaCy, seeded from the live schema) pulls out entities like dates and category values; the only LLM call in the whole pipeline turns that into one SQL SELECT (Llama 3.1 via Groq); sqlglot then parses and validates the SQL — rejecting anything that isn't a single read-only SELECT against known tables — before it ever runs; and finally a rule-based step picks a chart from the result shape and fills a template with the actual numbers for the summary. Use the bundled sample dataset or upload your own CSV."
      onClose={onClose}
    >
      {!API_URL && (
        <p className="mb-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-text-dim">
          Demo server isn't configured yet.
        </p>
      )}

      {!dataset ? (
        <DatasetChoice
          uploading={uploading}
          uploadSteps={uploadSteps}
          uploadError={uploadError}
          onUseSample={() => setDataset({ kind: 'sample' })}
          onPickFile={doUpload}
        />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2">
            <p className="text-xs text-text-dim">
              Using{' '}
              <span className="text-text-h">{dataset.kind === 'sample' ? 'sample dataset' : dataset.filename}</span>
            </p>
            <button type="button" onClick={reset} className="text-xs text-accent hover:underline">
              Change dataset
            </button>
          </div>

          <div className="max-h-[45vh] space-y-3 overflow-y-auto">
            {messages.length === 0 && dataset.kind === 'csv' && (
              <p className="text-sm text-text-dim">Ask a question about {dataset.filename}.</p>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-lg bg-gradient-to-r from-accent to-accent-2 px-3 py-2 text-sm text-black">
                    {m.text}
                  </div>
                </div>
              ) : (
                <AssistantMessage key={i} data={m.data} />
              ),
            )}

            {running && (
              <div className="rounded-lg border border-border bg-surface-2 p-3">
                <StepList steps={steps} />
                {steps.length === 0 && (
                  <p className="flex items-center gap-2 text-xs text-text-dim">
                    <Loader2 size={14} className="animate-spin" /> Thinking…
                  </p>
                )}
              </div>
            )}

            {!running &&
              (() => {
                const last = messages[messages.length - 1]
                const lastResult = last?.role === 'assistant' && last.data.type === 'result' ? last.data : null
                const chips =
                  messages.length === 0
                    ? dataset.kind === 'sample'
                      ? SAMPLE_EXAMPLES
                      : CSV_EXAMPLES
                    : lastResult
                      ? suggestFollowUps(lastResult)
                      : null
                if (!chips) return null
                return (
                  <div>
                    {messages.length === 0 && <p className="mb-2 text-sm text-text-dim">Try one of these:</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {chips.map((ex) => (
                        <button
                          key={ex}
                          type="button"
                          onClick={() => send(ex)}
                          className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-dim transition-colors hover:border-accent hover:text-text-h"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the data…"
              disabled={!API_URL}
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-50"
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={!input.trim() || running || !API_URL}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-black transition-opacity disabled:opacity-50"
            >
              {running && <Loader2 size={16} className="animate-spin" />}
              Ask
            </button>
          </div>
        </>
      )}
    </DemoModal>
  )
}
