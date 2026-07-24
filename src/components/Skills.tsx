import { motion } from 'framer-motion'
import Section from './Section'
import { skills } from '../content'

export default function Skills() {
  return (
    <Section id="skills" title="Tech Stack" eyebrow="Skills">
      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
            className="gradient-border rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]"
          >
            <h3 className="mb-3 text-sm font-semibold text-accent">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text transition-colors hover:border-accent-2 hover:text-text-h"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
