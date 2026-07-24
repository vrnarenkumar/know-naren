import { FileText, Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import DemoModal from './DemoModal'
import StepList, { type Step } from './StepList'
import { streamNDJSON } from '../../lib/ndjson'

const API_URL = import.meta.env.VITE_NOTEBOOK_AGENT_API_URL as string | undefined

function mergeStep(prev: Step[], evt: Step): Step[] {
  const next = [...prev]
  const idx = next.findIndex((s) => s.step === evt.step)
  if (idx >= 0) next[idx] = evt
  else next.push(evt)
  return next
}

export default function NotebookAgentDemo({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadSteps, setUploadSteps] = useState<Step[]>([])
  const [uploading, setUploading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [docName, setDocName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [question, setQuestion] = useState('')
  const [askSteps, setAskSteps] = useState<Step[]>([])
  const [asking, setAsking] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [sources, setSources] = useState<string[]>([])

  const doUpload = async () => {
    if (!file || uploading || !API_URL) return
    setUploadSteps([])
    setError(null)
    setSessionId(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      for await (const evt of streamNDJSON(`${API_URL}/upload`, { method: 'POST', body: form })) {
        if (evt.type === 'error') {
          setError(evt.message as string)
        } else if (evt.type === 'result') {
          setSessionId(evt.session_id as string)
          setDocName(evt.doc_name as string)
        } else {
          const step = evt as unknown as Step
          setUploadSteps((prev) => mergeStep(prev, step))
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
      setUploading(false)
    }
  }

  const doAsk = async () => {
    if (!question.trim() || !sessionId || asking || !API_URL) return
    setAskSteps([])
    setAnswer(null)
    setSources([])
    setError(null)
    setAsking(true)
    try {
      for await (const evt of streamNDJSON(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, question: question.trim() }),
      })) {
        if (evt.type === 'error') {
          setError(evt.message as string)
        } else if (evt.type === 'result') {
          setAnswer(evt.answer as string)
          setSources((evt.sources as string[]) ?? [])
        } else {
          const step = evt as unknown as Step
          setAskSteps((prev) => mergeStep(prev, step))
          if (step.status === 'error') setError(step.detail ?? 'Something went wrong.')
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach the demo server.')
    } finally {
      setAsking(false)
    }
  }

  return (
    <DemoModal
      title="notebook-agent"
      subtitle="Upload a PDF and ask questions about it — live RAG."
      repoUrl="https://github.com/vrnarenkumar/notebook-agent"
      accentColor={{ base: '#a78bfa', light: '#c4b5fd' }}
      howItWorks="Your PDF is parsed with PyMuPDF and split into overlapping chunks. Each chunk is embedded with a sentence-transformers model and stored in an in-memory FAISS index. When you ask a question, it's embedded the same way, matched against the most similar chunks in the index, and those chunks — plus your question — are sent to Llama 3.1 (via Groq) to generate an answer grounded only in your document. If the answer isn't in the retrieved chunks, it says so instead of guessing."
      onClose={onClose}
    >
      {!API_URL && (
        <p className="mb-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-text-dim">
          Demo server isn't configured yet.
        </p>
      )}

      {!sessionId && (
        <>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-2 px-6 py-8 text-center transition-colors hover:border-accent">
            {file ? <FileText size={22} className="text-accent" /> : <Upload size={22} className="text-text-dim" />}
            <span className="text-sm text-text-dim">{file ? file.name : 'Click to choose a PDF (max 15MB)'}</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <button
            type="button"
            onClick={doUpload}
            disabled={!file || uploading || !API_URL}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-black transition-opacity disabled:opacity-50"
          >
            {uploading && <Loader2 size={16} className="animate-spin" />}
            {uploading ? 'Processing…' : 'Upload & Process'}
          </button>

          {uploading && uploadSteps.length === 0 && (
            <p className="mt-3 text-xs text-text-dim">
              Waking up the demo server — first request can take up to a minute…
            </p>
          )}

          <StepList steps={uploadSteps} />
        </>
      )}

      {sessionId && (
        <>
          <p className="mb-4 text-sm text-text-dim">
            Indexed <span className="text-text-h">{docName}</span>. Ask it something.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What is this document about?"
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && doAsk()}
            />
            <button
              type="button"
              onClick={doAsk}
              disabled={!question.trim() || asking}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-black transition-opacity disabled:opacity-50"
            >
              {asking && <Loader2 size={16} className="animate-spin" />}
              {asking ? 'Thinking…' : 'Ask'}
            </button>
          </div>

          <StepList steps={askSteps} />

          {answer && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-text-h">Answer</p>
              <p className="mt-1 text-sm text-text">{answer}</p>
              {sources.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-accent">Source chunks ({sources.length})</summary>
                  <ul className="mt-2 space-y-2">
                    {sources.map((s, i) => (
                      <li key={i} className="rounded-lg border border-border bg-surface-2 p-2 text-xs text-text-dim">
                        {s}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>
      )}
    </DemoModal>
  )
}
