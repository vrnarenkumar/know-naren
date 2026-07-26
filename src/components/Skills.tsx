import { motion } from 'framer-motion'
import Section from './Section'
import { skills } from '../content'

const cardLayout = [
  'lg:col-span-2',
  'lg:col-span-4',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
]

export default function Skills() {
  return (
    <Section id="skills" title="Tech Stack" eyebrow="Skills" className="py-8">
      <div className="-mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {skills.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
            className={`group relative min-h-40 overflow-hidden rounded-2xl border border-border/90 bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-text-dim hover:bg-surface-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] ${cardLayout[i] ?? ''}`}
          >
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[-0.01em] text-text-h">{group.category}</h3>
              <span className="text-[10px] font-medium tracking-[0.12em] text-text-dim uppercase">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-wrap content-start gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-xs leading-4 text-text transition-colors duration-200 group-hover:border-white/10 group-hover:text-text-h"
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
