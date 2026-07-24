import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import SectionHeading from './SectionHeading'

type SectionProps = {
  id: string
  title: string
  eyebrow?: string
  children: ReactNode
  className?: string
}

export default function Section({ id, title, eyebrow, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className="relative flex min-h-[calc(100vh-4rem)] w-full snap-start snap-always items-center overflow-hidden"
    >
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="glow-orb left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 bg-accent/10"
      />
      <div className={`relative mx-auto w-full max-w-5xl px-6 py-16 ${className}`}>
        <SectionHeading title={title} eyebrow={eyebrow} />
        {children}
      </div>
    </section>
  )
}
