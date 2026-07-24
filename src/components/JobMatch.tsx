import { FileText, Sparkles, Upload } from 'lucide-react'
import { useState } from 'react'
import Section from './Section'

export default function JobMatch() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [jdText, setJdText] = useState('')

  return (
    <Section id="jd-match" title="JD Match" eyebrow="Recruiter Tool">
      <p className="mb-8 max-w-2xl text-text-dim">
        Upload a job description or paste it in — check how well it lines up with my profile.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="gradient-border flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center transition-colors hover:border-accent">
          {fileName ? <FileText size={24} className="text-accent" /> : <Upload size={24} className="text-text-dim" />}
          <span className="text-sm text-text-dim">{fileName ?? 'Click to upload a JD PDF'}</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
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

      <button
        type="button"
        disabled
        className="mt-6 flex cursor-not-allowed items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-black opacity-50"
      >
        <Sparkles size={16} /> Check Match — Coming Soon
      </button>
    </Section>
  )
}
