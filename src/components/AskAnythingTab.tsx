import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import DemoModal from './demos/DemoModal'
import { API_URL } from '../lib/api'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-text-dim">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  )
}

export default function AskAnythingTab() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = name.trim() && email.trim() && question.trim() && !submitting && !!API_URL

  const close = () => {
    setOpen(false)
    // Reset for next time, but only after the close animation would've settled.
    setTimeout(() => {
      setName('')
      setEmail('')
      setPhone('')
      setLinkedin('')
      setQuestion('')
      setDone(false)
      setError(null)
    }, 300)
  }

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          linkedin: linkedin.trim(),
          question: question.trim(),
        }),
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask for anything"
        className="fixed right-0 top-1/2 z-40 -translate-y-1/2 rounded-l-lg border border-r-0 border-border bg-surface px-2 py-4 text-xs font-medium tracking-wide text-text-dim shadow-lg transition-colors hover:border-accent hover:text-text-h"
        style={{ writingMode: 'vertical-rl' }}
      >
        Ask for anything
      </button>

      <AnimatePresence>
        {open && (
          <DemoModal title="Ask for anything" subtitle="Questions, feedback, opportunities — I read everything." onClose={close}>
            {!API_URL && (
              <p className="mb-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-text-dim">
                Not configured yet — please email me directly instead.
              </p>
            )}

            {done ? (
              <p className="text-sm text-text">
                Thanks, {name.trim().split(' ')[0]}! I'll get back to you soon — feel free to reach out at{' '}
                <a href="mailto:vrnarenkumar@gmail.com" className="underline hover:text-text-h">
                  vrnarenkumar@gmail.com
                </a>{' '}
                in the meantime.
              </p>
            ) : (
              <div className="space-y-3">
                <Field label="Name" required>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={!API_URL}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-50"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={!API_URL}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-50"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Contact number">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Optional"
                      disabled={!API_URL}
                      className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-50"
                    />
                  </Field>
                  <Field label="LinkedIn">
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="Optional"
                      disabled={!API_URL}
                      className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-50"
                    />
                  </Field>
                </div>
                <Field label="Question" required>
                  <textarea
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What do you want to ask?"
                    rows={4}
                    disabled={!API_URL}
                    className="w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-50"
                  />
                </Field>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? 'Sending…' : 'Send'}
                </button>
              </div>
            )}
          </DemoModal>
        )}
      </AnimatePresence>
    </>
  )
}
