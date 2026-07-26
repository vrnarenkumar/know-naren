import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import DemoModal from './demos/DemoModal'
import { API_URL } from '../lib/api'

export default function ResumeRequestModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!email.trim() || submitting || !API_URL) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/resume-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), feedback: feedback.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || 'Request failed')
      }
      setDone(true)
    } catch {
      setError('Could not send that — please try again, or email me directly instead.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DemoModal title="Get my resume" subtitle="Leave your email and I'll forward it to you personally." onClose={onClose}>
      {!API_URL && (
        <p className="mb-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-text-dim">
          Not configured yet — please email me directly instead.
        </p>
      )}

      {done ? (
        <p className="text-sm text-text">
          Thanks! The resume will be forwarded to you shortly — feel free to reach out at{' '}
          <a href="mailto:vrnarenkumar@gmail.com" className="underline hover:text-text-h">
            vrnarenkumar@gmail.com
          </a>{' '}
          in the meantime.
        </p>
      ) : (
        <div className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={!API_URL}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-50"
          />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Anything I should know? (optional)"
            rows={3}
            disabled={!API_URL}
            className="w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-50"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="button"
            onClick={submit}
            disabled={!email.trim() || submitting || !API_URL}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Sending…' : 'Request Resume'}
          </button>
        </div>
      )}
    </DemoModal>
  )
}
