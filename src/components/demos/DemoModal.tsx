import { motion } from 'framer-motion'
import { Github, X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

type DemoModalProps = {
  title: string
  subtitle?: string
  repoUrl?: string
  howItWorks?: string
  accentColor?: { base: string; light: string }
  onClose: () => void
  children: ReactNode
}

export default function DemoModal({
  title,
  subtitle,
  repoUrl,
  howItWorks,
  accentColor,
  onClose,
  children,
}: DemoModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-surface"
      >
        <div
          className="h-1.5 shrink-0 bg-gradient-to-r from-accent to-accent-2"
          style={
            accentColor
              ? { background: `linear-gradient(90deg, ${accentColor.base}, ${accentColor.light})` }
              : undefined
          }
        />
        <div className="flex shrink-0 items-start justify-between gap-4 p-6 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-text-h">{title}</h3>
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-text-dim transition-colors hover:text-text-h"
                >
                  <Github size={14} /> Source
                </a>
              )}
            </div>
            {subtitle && <p className="mt-1 text-sm text-text-dim">{subtitle}</p>}
            {howItWorks && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-text-dim hover:text-text-h">
                  How does this work?
                </summary>
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-text-dim">{howItWorks}</p>
              </details>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-text-dim transition-colors hover:text-text-h"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-6">{children}</div>
      </motion.div>
    </motion.div>
  )
}
