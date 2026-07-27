import { AnimatePresence, motion } from 'framer-motion'
import { Download, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { hero } from '../content'
import narenPhoto from '../assets/naren.jpg'
import ResumeRequestModal from './ResumeRequestModal'

function useTypewriter(words: string[]) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    const word = words[wordIndex]
    let timeout: number

    if (phase === 'typing') {
      if (text.length < word.length) {
        timeout = window.setTimeout(() => setText(word.slice(0, text.length + 1)), 65)
      } else {
        timeout = window.setTimeout(() => setPhase('pausing'), 1300)
      }
    } else if (phase === 'pausing') {
      timeout = window.setTimeout(() => setPhase('deleting'), 500)
    } else {
      if (text.length > 0) {
        timeout = window.setTimeout(() => setText(word.slice(0, text.length - 1)), 35)
      } else {
        setPhase('typing')
        setWordIndex((i) => (i + 1) % words.length)
      }
    }

    return () => window.clearTimeout(timeout)
  }, [text, phase, wordIndex, words])

  return text
}

export default function LandingPage() {
  const role = useTypewriter(hero.roles)
  const [resumeModalOpen, setResumeModalOpen] = useState(false)

  return (
    <section
      id="landing-page"
      className="bg-hero-gradient relative flex min-h-[calc(100vh-4rem)] w-full snap-start snap-always items-center overflow-hidden px-6"
    >
      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-dim"
            >
              <MapPin size={12} className="text-emerald-400" />
              {hero.hometown}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-dim"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              {hero.eyebrow}
            </motion.span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="mt-6 text-3xl font-extrabold uppercase tracking-tight text-text-h sm:text-5xl"
          >
            {hero.name}
          </motion.h1>

          <div className="mt-2 h-7 sm:h-9">
            <p className="text-gradient text-lg font-semibold sm:text-2xl">
              {role}
              <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-accent-2 align-middle text-transparent">
                |
              </span>
            </p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mx-auto mt-5 max-w-xl text-text-dim lg:mx-0"
          >
            {hero.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.54, ease: 'easeOut' }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <button
              type="button"
              onClick={() => setResumeModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              <Download size={16} /> Resume
            </button>
            <a
              href={`mailto:${hero.email}`}
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-text transition-colors hover:border-accent hover:text-text-h"
            >
              <Mail size={16} /> Email
            </a>
            <a
              href={hero.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-text transition-colors hover:border-accent hover:text-text-h"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a
              href={hero.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-text transition-colors hover:border-accent hover:text-text-h"
            >
              <Github size={16} /> GitHub
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mx-auto h-56 w-56 sm:h-72 sm:w-72"
        >
          <div className="animate-spin-slow absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--color-accent),transparent_30%,var(--color-accent-2),transparent_70%,var(--color-accent))] opacity-70" />
          <img
            src={narenPhoto}
            alt={hero.name}
            className="absolute inset-1.5 rounded-full border-4 border-bg object-cover"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {resumeModalOpen && <ResumeRequestModal onClose={() => setResumeModalOpen(false)} />}
      </AnimatePresence>
    </section>
  )
}
