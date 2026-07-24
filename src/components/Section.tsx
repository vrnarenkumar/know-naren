import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  title: string
  eyebrow?: string
  children: ReactNode
  className?: string
}

export default function Section({ id, title, eyebrow, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24 ${className}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-widest text-accent-2 uppercase"
        >
          <span className="h-px w-6 bg-accent-2" />
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-12 text-3xl font-bold text-text-h sm:text-4xl"
      >
        {title}
      </motion.h2>
      {children}
    </section>
  )
}
