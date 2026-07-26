import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Maximize2, MessageCircle, Minimize2, Paperclip, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import StepList, { type Step } from './demos/StepList'
import { API_URL } from '../lib/api'
import { streamNDJSON } from '../lib/ndjson'
import ExperiencePane from './ExperiencePane'
import MatchProjectCard, { type MatchProject } from './MatchProjectCard'
import { detectExperienceRoles } from '../lib/matchExperience'
import { highlightMatches, renderRichText } from '../lib/highlight'

type Turn = {
  id: string
  userLabel: string
  steps: Step[]
  summary: string | null
  projects: MatchProject[] | null
  closing: string | null
  answer: string | null
  redirect: string | null
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

export default function JobMatchChat() {
  const [open, setOpen] = useState(false)
  const [manualExpand, setManualExpand] = useState(false)
  const [manualCollapsed, setManualCollapsed] = useState(false)
  const [jdText, setJdText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, open])

  const latestDone = [...turns].reverse().find((t) => !t.running && !t.error && !t.redirect) ?? null
  const matchedRoles = latestDone
    ? detectExperienceRoles(
        [latestDone.userLabel, latestDone.summary, latestDone.answer, latestDone.closing].filter(Boolean).join(' '),
      )
    : []
  const hasSidebarContent =
    !!latestDone && (matchedRoles.length > 0 || (latestDone.projects && latestDone.projects.length > 0))
  const fullscreen = open && hasSidebarContent && !manualCollapsed

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (fullscreen) setManualCollapsed(true)
      else if (open) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen, open])

  const closeWidget = () => {
    setOpen(false)
    setManualCollapsed(false)
  }

  const anyRunning = turns.some((t) => t.running)
  const canSend = (!!file || jdText.trim().length > 0) && !anyRunning && !!API_URL
  const expanded = manualExpand

  const send = async () => {
    if (!canSend) return
    const id = crypto.randomUUID()
    const userLabel = file ? `📄 ${file.name}` : jdText.trim()
    const thisFile = file
    const thisText = jdText.trim()

    setTurns((prev) => [
      ...prev,
      { id, userLabel, steps: [], summary: null, projects: null, closing: null, answer: null, redirect: null, error: null, running: true },
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
        } else if (evt.type === 'redirect') {
          setTurns((prev) => updateTurn(prev, id, { redirect: evt.message as string, running: false }))
        } else if (evt.type === 'result') {
          setTurns((prev) =>
            updateTurn(prev, id, {
              summary: (evt.summary as string) || null,
              projects: (evt.projects as MatchProject[]) || null,
              closing: (evt.closing as string) || null,
              answer: (evt.answer as string) || null,
              running: false,
            }),
          )
          setManualCollapsed(false)
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

  const conversation = (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5 [overflow-wrap:anywhere]"
    >
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-accent">
          <Sparkles size={14} />
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-surface-2 px-4 py-3 text-[13px] leading-5 text-text">
          Hi, I'm Naren. Paste a job description and I'll show you why I'd be a great fit — or just ask me
          something, like "do you have experience with ADK?"
        </div>
      </div>

      {turns.map((turn) => (
        <div key={turn.id} className="space-y-4">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-[15px] leading-6 text-black">
              {turn.userLabel}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-accent">
              <Sparkles size={14} />
            </div>
            <div className="min-w-0 max-w-[90%] flex-1 rounded-2xl rounded-tl-md bg-surface-2 px-4 py-4">
              {turn.steps.length > 0 && (
                <div className={turn.answer || turn.summary || turn.error || turn.redirect ? 'border-b border-border pb-4' : ''}>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Processing</p>
                  <StepList steps={turn.steps} />
                </div>
              )}
              {turn.error && <p className="pt-4 text-[15px] leading-7 text-red-300">{turn.error}</p>}
              {turn.redirect && <p className="pt-4 text-[15px] leading-7 text-text">{turn.redirect}</p>}
              {turn.answer && <p className="pt-4 text-[15px] leading-7 tracking-[0.002em] text-text">{renderRichText(turn.answer, turn.userLabel)}</p>}
              {turn.summary && (
                <div className="space-y-4 pt-4">
                  <p className="text-[15px] leading-7 tracking-[0.002em] text-text">{highlightMatches(turn.summary, turn.userLabel)}</p>
                  {turn.projects && turn.projects.length > 0 && (
                    <div className="space-y-2">
                      {turn.projects.map((p) => (
                        <MatchProjectCard key={p.name} project={p} query={turn.userLabel} />
                      ))}
                    </div>
                  )}
                  {turn.closing && <p className="text-[15px] leading-7 tracking-[0.002em] text-text">{highlightMatches(turn.closing, turn.userLabel)}</p>}
                </div>
              )}
              {turn.running && turn.steps.length === 0 && (
                <span className="flex items-center gap-1 py-0.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-dim [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-dim [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-dim" />
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const composer = (
    <div className="shrink-0 border-t border-border bg-surface p-3">
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
          placeholder="Paste a JD or ask a question…"
          rows={1}
          className="max-h-24 min-h-9 flex-1 resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm leading-5 text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
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
      <p className="mt-2 text-[11px] leading-4 text-text-dim">
        Chat responses may be wrong or out of date — please consider my{' '}
        <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noreferrer" className="underline hover:text-text-h">
          resume
        </a>{' '}
        or contact me at{' '}
        <a href="mailto:vrnarenkumar@gmail.com" className="underline hover:text-text-h">
          vrnarenkumar@gmail.com
        </a>
        .
      </p>
    </div>
  )

  return (
    <div className={`fixed bottom-20 right-4 ${fullscreen ? 'z-[70]' : 'z-40'} sm:right-6`}>
      <AnimatePresence>
        {open && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut', layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            className={
              fullscreen
                ? 'fixed inset-0 z-[70] flex flex-col overflow-hidden border border-border bg-surface shadow-2xl'
                : `flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl transition-[width,height] duration-300 ease-out ${
                    expanded
                      ? 'h-[min(38rem,calc(100dvh-6.5rem))] w-[min(30rem,calc(100vw-2rem))]'
                      : 'h-[min(34rem,calc(100dvh-6.5rem))] w-[min(26rem,calc(100vw-2rem))]'
                  }`
            }
          >
            <div className="h-1.5 shrink-0 bg-gradient-to-r from-accent to-accent-2" />
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-h">Ask about me</p>
                <p className="mt-0.5 text-xs leading-5 text-text-dim">Paste a JD, or ask if I have experience with something.</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {fullscreen ? (
                  <button
                    type="button"
                    aria-label="Collapse to widget"
                    onClick={() => setManualCollapsed(true)}
                    className="text-text-dim transition-colors hover:text-text-h"
                  >
                    <Minimize2 size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label={expanded ? 'Shrink chat' : 'Expand chat'}
                    onClick={() => setManualExpand((v) => !v)}
                    className="text-text-dim transition-colors hover:text-text-h"
                  >
                    {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Close"
                  onClick={closeWidget}
                  className="text-text-dim transition-colors hover:text-text-h"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {fullscreen ? (
              <div className="flex min-h-0 flex-1 overflow-hidden">
                <aside className="hidden w-[340px] shrink-0 overflow-y-auto border-r border-border/60 md:block">
                  <ExperiencePane turn={latestDone} matchedRoles={matchedRoles} query={latestDone?.userLabel ?? ''} />
                </aside>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  {conversation}
                  {composer}
                </div>
              </div>
            ) : (
              <>
                {conversation}
                {composer}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!open && !fullscreen && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open JD Match chat"
          whileHover={{ scale: 1.05 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 text-black shadow-lg"
        >
          {!open && <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />}
          {open ? <X size={22} /> : <MessageCircle size={22} className="relative" />}
        </motion.button>
      )}
    </div>
  )
}
