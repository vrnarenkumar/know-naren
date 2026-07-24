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
      className="bg-hero-gradient relative flex min-h-[calc(100vh-4rem)] w-full snap-start snap-always items-center overflow-hidden"
    >
      <div className={`relative mx-auto w-full max-w-5xl px-6 py-16 ${className}`}>
        <SectionHeading title={title} eyebrow={eyebrow} />
        {children}
      </div>
    </section>
  )
}
