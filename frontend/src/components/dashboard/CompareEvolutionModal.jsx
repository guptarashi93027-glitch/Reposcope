import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { timeTravelPoints } from '../../data/mockData.js'
import RepositoryGrowthChart from './RepositoryGrowthChart.jsx'

const first = timeTravelPoints[0]
const last = timeTravelPoints[timeTravelPoints.length - 1]
const rows = [
  { label: 'Commits', key: 'commits' },
  { label: 'Developers', key: 'developers' },
  { label: 'Files', key: 'files' },
]

export default function CompareEvolutionModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/30 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-card border border-line max-w-lg w-full p-6 lg:p-8 shadow-lift"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-xl text-ink">{first.date} vs {last.date}</h3>
                <button onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close"><X size={18} /></button>
              </div>
              <p className="text-sm text-ink-soft mb-5">Activity growth across the full analyzed history</p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {rows.map((r) => (
                  <div key={r.key} className="bg-bg rounded-lg border border-line p-3 text-center">
                    <p className="text-[11px] text-ink-soft mb-1">{r.label}</p>
                    <p className="font-display text-base text-ink-soft">{first[r.key]}</p>
                    <p className="text-[10px] text-ink-soft my-0.5">→</p>
                    <p className="font-display text-lg text-ink">{last[r.key]}</p>
                  </div>
                ))}
              </div>

              <div className="bg-bg rounded-lg border border-line p-4">
                <RepositoryGrowthChart height={180} />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
