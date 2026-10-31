import { useState } from 'react'
import { motion } from 'framer-motion'
import { timeTravelPoints } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { SectionHeading } from '../ui/Card.jsx'
import CompareEvolutionModal from './CompareEvolutionModal.jsx'

export default function TimeTravelSlider() {
  const [index, setIndex] = useState(timeTravelPoints.length - 1)
  const [compareOpen, setCompareOpen] = useState(false)
  const point = timeTravelPoints[index]
  const pct = (index / (timeTravelPoints.length - 1)) * 100

  return (
    <Card className="p-6 lg:p-8">
      <SectionHeading
        eyebrow="Navigate through repository history"
        title="Time Travel"
        action={
          <button
            onClick={() => setCompareOpen(true)}
            className="text-[13px] font-medium text-primary-600 hover:text-primary-700 whitespace-nowrap"
          >
            Compare Evolution
          </button>
        }
      />

      <div className="relative mt-8 mb-2 px-1">
        <div className="h-1.5 rounded-full bg-line relative">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary-300 to-teal-400"
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={timeTravelPoints.length - 1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6 -top-2"
          aria-label="Time travel slider"
        />

        <motion.div
          className="absolute -top-[7px] flex flex-col items-center pointer-events-none"
          animate={{ left: `calc(${pct}% - 8px)` }}
          transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        >
          <div className="w-4 h-4 rounded-full bg-primary-500 border-2 border-card shadow-lift" />
          <span className="mt-2 text-[10px] font-semibold tracking-wide text-primary-600 uppercase whitespace-nowrap">
            You are here
          </span>
        </motion.div>

        <div className="flex justify-between mt-8">
          {timeTravelPoints.map((p, i) => (
            <button
              key={p.date}
              onClick={() => setIndex(i)}
              className={`text-[11px] ${i === index ? 'text-ink font-medium' : 'text-ink-soft'}`}
            >
              {p.date}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <TravelStat label="commits" value={point.commits} />
        <TravelStat label="files" value={point.files} />
        <TravelStat label="developers" value={point.developers} />
      </div>

      <CompareEvolutionModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </Card>
  )
}

function TravelStat({ label, value }) {
  return (
    <div className="bg-bg rounded-lg border border-line p-4 text-center">
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl text-ink"
      >
        {value.toLocaleString()}
      </motion.p>
      <p className="text-xs text-ink-soft mt-1">{label}</p>
    </div>
  )
}
