import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import Section from './Section'
import { education } from '../content'

export default function Education() {
  return (
    <Section id="education" title="Education">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-start gap-4 rounded-xl border border-border bg-surface p-6"
      >
        <div className="rounded-lg bg-accent/10 p-3 text-accent">
          <GraduationCap size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-h">{education.degree}</h3>
          <p className="text-sm text-text">
            {education.institution} · {education.location}
          </p>
          <p className="mt-1 text-sm text-text-dim">{education.dates}</p>
        </div>
      </motion.div>
    </Section>
  )
}
