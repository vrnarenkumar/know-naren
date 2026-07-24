import { motion } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'
import { hero } from '../content'
import narenPhoto from '../assets/naren.jpg'

export default function Hero() {
  return (
    <section
      id="hero"
      className="bg-glow flex min-h-screen w-full flex-col items-center justify-center px-6 pt-20 text-center"
    >
      <motion.img
        src={narenPhoto}
        alt={hero.name}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8 h-32 w-32 rounded-full border-2 border-accent/50 object-cover shadow-[0_0_40px_rgba(139,92,246,0.35)] sm:h-40 sm:w-40"
      />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="text-4xl font-extrabold uppercase tracking-tight text-text-h sm:text-6xl"
      >
        {hero.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="text-gradient mt-4 max-w-2xl text-lg font-semibold sm:text-xl"
      >
        {hero.title}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
        className="mt-6 max-w-xl text-text-dim"
      >
        {hero.summary}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href={`mailto:${hero.email}`}
          className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-text-h"
        >
          <Mail size={16} /> Email
        </a>
        <a
          href={hero.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-text-h"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
        <a
          href={hero.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-text-h"
        >
          <Github size={16} /> GitHub
        </a>
      </motion.div>
    </section>
  )
}
