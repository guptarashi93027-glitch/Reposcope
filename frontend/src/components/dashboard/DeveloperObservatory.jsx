import { motion } from 'framer-motion'
import { developers as mockDevelopers } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { SectionHeading } from '../ui/Card.jsx'

export default function DeveloperObservatory({ liveData }) {
  const developers = liveData || mockDevelopers
  const maxPct = Math.max(...developers.map(d => d.pct || 0), 1)

  return (
    <Card className="p-6 lg:p-8">
      <SectionHeading
        eyebrow="Who contributed?"
        title="Developer Observatory"
        subtitle="Contribution patterns"
        action={
          <span className="text-[13px] text-ink-soft whitespace-nowrap">
            {developers.length} active developer{developers.length !== 1 ? 's' : ''}
          </span>
        }
      />

      <div className="flex flex-col gap-3.5">
        {developers.map((d, idx) => (
          <div key={(d.name || '') + idx} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
              style={{ backgroundColor: d.color }}
            >
              {d.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[13px] mb-1">
                <span className="font-medium text-ink">{d.name}</span>
                <span className="text-ink-soft">{d.commits} commits · {d.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-bg overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: d.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.pct / maxPct) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.05 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
