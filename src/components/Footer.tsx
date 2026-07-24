import { motion } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'
import { hero } from '../content'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="border-t border-border px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-bold text-text-h">Let's build something together.</h2>
        <p className="mt-2 text-text-dim">Open to new opportunities and interesting problems.</p>

        <div className="mt-6 flex items-center justify-center gap-5">
          <a
            href={`mailto:${hero.email}`}
            aria-label="Email"
            className="text-text-dim transition-colors hover:text-accent"
          >
            <Mail size={22} />
          </a>
          <a
            href={hero.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-text-dim transition-colors hover:text-accent"
          >
            <Linkedin size={22} />
          </a>
          <a
            href={hero.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-text-dim transition-colors hover:text-accent"
          >
            <Github size={22} />
          </a>
        </div>

        <p className="mt-10 text-xs text-text-dim">
          © {year} {hero.name}. Built with React, Tailwind CSS &amp; Framer Motion.
        </p>
      </motion.div>
    </footer>
  )
}
