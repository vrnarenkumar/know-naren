import { AnimatePresence, motion } from 'framer-motion'
import { FileText, MessageCircle, Paperclip, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import StepList, { type Step } from './demos/StepList'
import { API_URL } from '../lib/api'
import { streamNDJSON } from '../lib/ndjson'
import { colorForProject } from '../lib/projectColor'

type MatchProject = { name: string; match_reason: string; keywords: string[] }

type Turn = {
  id: string
  userLabel: string
  steps: Step[]
  summary: string | null
  projects: MatchProject[] | null
  closing: string | null
  error: string | null
  running: boolean
}

function mergeStep(prev: Step[], evt: Step): Step[] {
  const next = [...prev]
  const idx = next.findIndex((s) => s.step === evt.step)
  if (idx >= 0) next[idx] = evt
  else next.push(evt)
  return next
}

function updateTurn(turns: Turn[], id: string, patch: Partial<Turn>): Turn[] {
  return turns.map((t) => (t.id === id ? { ...t, ...patch } : t))
}

function MatchProjectCard({ project }: { project: MatchProject }) {
  const color = colorForProject(project.name)
  return (
    <div
      className="rounded-lg border p-3"
      style={{ borderColor: `${color.base}4D`, backgroundColor: `${color.base}0D` }}
    >
      <p className="text-sm font-semibold" style={{ color: color.base }}>
        {project.name}
      </p>
      <p className="mt-1 text-sm text-text">{project.match_reason}</p>
      {project.keywords.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full border px-2 py-0.5 text-[11px]"
              style={{ borderColor: `${color.base}4D`, backgroundColor: `${color.base}1A`, color: color.base }}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function JobMatchChat() {
  const [open, setOpen] = useState(false)
  const [jdText, setJdText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, open])

  const anyRunning = turns.some((t) => t.running)
  const canSend = (!!file || jdText.trim().length > 0) && !anyRunning && !!API_URL
  const expanded = turns.length > 0

  const send = async () => {
    if (!canSend) return
    const id = crypto.randomUUID()
    const userLabel = file ? `📄 ${file.name}` : jdText.trim()
    const thisFile = file
    const thisText = jdText.trim()

    setTurns((prev) => [
      ...prev,
      { id, userLabel, steps: [], summary: null, projects: null, closing: null, error: null, running: true },
    ])
    setJdText('')
    setFile(null)

    try {
      const form = new FormData()
      if (thisText) form.append('jd_text', thisText)
      if (thisFile) form.append('jd_file', thisFile)

      for await (const evt of streamNDJSON(`${API_URL}/jd-match/match`, { method: 'POST', body: form })) {
        if (evt.type === 'error') {
          setTurns((prev) => updateTurn(prev, id, { error: evt.message as string, running: false }))
        } else if (evt.type === 'result') {
          setTurns((prev) =>
            updateTurn(prev, id, {
              summary: (evt.summary as string) || null,
              projects: (evt.projects as MatchProject[]) || [],
              closing: (evt.closing as string) || null,
              running: false,
            }),
          )
        } else {
          const step = evt as unknown as Step
          setTurns((prev) =>
            updateTurn(prev, id, {
              steps: mergeStep(prev.find((t) => t.id === id)?.steps ?? [], step),
              ...(step.status === 'error' ? { error: step.detail ?? 'Something went wrong.', running: false } : {}),
            }),
          )
        }
      }
    } catch (e) {
      setTurns((prev) =>
        updateTurn(prev, id, {
          error:
            e instanceof Error
              ? e.message
              : 'Could not reach the demo server. It may be waking up — try again in a moment.',
          running: false,
        }),
      )
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl transition-[width,height] duration-300 ease-out ${
              expanded
                ? 'h-[42rem] max-h-[85vh] w-[min(30rem,calc(100vw-3rem))]'
                : 'h-[28rem] max-h-[70vh] w-[min(24rem,calc(100vw-3rem))]'
            }`}
          >
            <div className="h-1.5 shrink-0 bg-gradient-to-r from-accent to-accent-2" />
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-text-h">Ask about me</p>
                <p className="text-xs text-text-dim">Paste your JD and see if I would be a right fit for your JD.</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="text-text-dim transition-colors hover:text-text-h"
              >
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent">
                  <Sparkles size={14} />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-2 px-3 py-2 text-sm text-text">
                  Hi, I'm Naren. Paste a job description or attach a PDF and I'll show you why I'd be a great fit.
                </div>
              </div>

              {turns.map((turn) => (
                <div key={turn.id} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-accent to-accent-2 px-3 py-2 text-sm text-black">
                      {turn.userLabel}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent">
                      <Sparkles size={14} />
                    </div>
                    <div className="max-w-[90%] flex-1 rounded-2xl rounded-tl-sm bg-surface-2 px-3 py-2.5 text-sm">
                      {turn.steps.length > 0 && <StepList steps={turn.steps} />}
                      {turn.error && <p className="text-red-300">{turn.error}</p>}
                      {turn.summary && (
                        <div className="space-y-3">
                          <p className="text-text">{turn.summary}</p>
                          {turn.projects && turn.projects.length > 0 && (
                            <div className="space-y-2">
                              {turn.projects.map((p) => (
                                <MatchProjectCard key={p.name} project={p} />
                              ))}
                            </div>
                          )}
                          {turn.closing && <p className="text-text">{turn.closing}</p>}
                        </div>
                      )}
                      {turn.running && turn.steps.length === 0 && (
                        <p className="text-xs text-text-dim">Waking up the demo server…</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 border-t border-border p-3">
              {file && (
                <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-text-dim">
                  <FileText size={14} className="text-accent" />
                  {file.name}
                  <button type="button" onClick={() => setFile(null)} className="ml-auto hover:text-text-h">
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface-2 text-text-dim transition-colors hover:border-accent hover:text-text-h">
                  <Paperclip size={16} />
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="Paste a job description…"
                  rows={1}
                  className="max-h-24 flex-1 resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!canSend}
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-accent to-accent-2 text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>
              {!API_URL && <p className="mt-2 text-[11px] text-text-dim">Demo server isn't configured yet.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close JD Match chat' : 'Open JD Match chat'}
        whileHover={{ scale: 1.05 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 text-black shadow-lg"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />}
        {open ? <X size={22} /> : <MessageCircle size={22} className="relative" />}
      </motion.button>
    </div>
  )
}
