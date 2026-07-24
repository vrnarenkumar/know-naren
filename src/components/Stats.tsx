import { motion } from 'framer-motion'
import { Clock, DollarSign, Rocket, Users } from 'lucide-react'
import { stats } from '../content'

const icons = [Clock, Users, Rocket, DollarSign]

export default function Stats() {
  return (
    <div className="mx-auto -mt-10 w-full max-w-5xl px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = icons[i]
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="gradient-border rounded-xl border border-border bg-surface p-5"
            >
              <Icon size={20} className="text-accent-2" />
              <p className="mt-3 text-2xl font-bold text-text-h">{s.value}</p>
              <p className="text-xs text-text-dim">{s.label}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
