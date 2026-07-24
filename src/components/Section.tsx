import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  title: string
  children: ReactNode
  className?: string
}

export default function Section({ id, title, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24 ${className}`}>
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
