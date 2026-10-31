import { AnimatePresence, motion } from 'framer-motion'
import { X, GitCommit, Users, Plus, Minus } from 'lucide-react'

const riskStyles = {
  High: 'bg-coral-50 text-coral-500',
  Medium: 'bg-amber-50 text-amber-500',
  Low: 'bg-teal-50 text-teal-600',
}

export default function HotspotDetailDrawer({ hotspot, onClose }) {
  return (
    <AnimatePresence>
      {hotspot && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/25 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-screen w-full max-w-sm bg-card border-l border-line z-50 p-6 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-base text-ink">{hotspot.file}</span>
              <button onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <span className={`mt-3 text-[11px] font-medium px-2.5 py-1 rounded-full w-fit ${riskStyles[hotspot.risk]}`}>
              {hotspot.risk} risk
            </span>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-bg rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-ink-soft text-[11px]"><GitCommit size={12} /> Commits</div>
                <p className="font-display text-xl text-ink mt-1">{hotspot.changes}</p>
              </div>
              <div className="bg-bg rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-ink-soft text-[11px]"><Users size={12} /> Contributors</div>
                <p className="font-display text-xl text-ink mt-1">{hotspot.contributors}</p>
              </div>
              <div className="bg-bg rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-teal-600 text-[11px]"><Plus size={12} /> Lines added</div>
                <p className="font-display text-xl text-ink mt-1">{hotspot.added.toLocaleString()}</p>
              </div>
              <div className="bg-bg rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-coral-500 text-[11px]"><Minus size={12} /> Lines removed</div>
                <p className="font-display text-xl text-ink mt-1">{hotspot.removed.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-primary-50 border border-primary-100 p-4">
              <p className="text-[11px] font-semibold tracking-wide text-primary-600 uppercase mb-1.5">AI Observation</p>
              <p className="text-[13px] text-ink-soft leading-relaxed">{hotspot.note}</p>
            </div>

            <button className="mt-auto w-full bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:bg-ink/90 transition-colors">
              Explore File Changes →
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
