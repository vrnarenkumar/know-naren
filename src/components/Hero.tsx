import { AnimatePresence, motion } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { hero } from '../content'
import narenPhoto from '../assets/naren.jpg'

const badges = [
  { label: 'Python', className: 'left-[-1.5rem] top-6' },
  { label: 'LangGraph', className: 'right-[-2rem] top-1/3' },
  { label: 'AWS', className: 'bottom-2 left-2' },
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % hero.roles.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="hero"
      className="bg-hero-gradient relative flex min-h-[calc(100vh-4rem)] w-full snap-start snap-always items-center overflow-hidden px-6"
    >
      <div className="glow-orb -left-24 top-24 h-72 w-72 bg-accent/20" />
      <div className="glow-orb -right-24 bottom-24 h-72 w-72 bg-accent-2/15" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-dim"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="mt-6 text-3xl font-extrabold uppercase tracking-tight text-text-h sm:text-5xl"
          >
            {hero.name}
          </motion.h1>

          <div className="mt-2 h-12 sm:h-16">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-gradient text-3xl font-extrabold sm:text-5xl"
              >
                {hero.roles[roleIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mx-auto mt-5 max-w-xl text-text-dim lg:mx-0"
          >
            {hero.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.54, ease: 'easeOut' }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href={`mailto:${hero.email}`}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              <Mail size={16} /> Email Me
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

          {badges.map((b, i) => (
            <motion.span
              key={b.label}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute ${b.className} rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text shadow-lg`}
            >
              {b.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
