import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GitCommit, Users, FileText, Calendar } from 'lucide-react'
import { milestones, growthSeries as mockGrowthSeries } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { SectionHeading } from '../ui/Card.jsx'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

export default function EvolutionTimeline({ liveData }) {
  const [active, setActive] = useState(milestones[milestones.length - 1].id)
  const activeMilestone = milestones.find((m) => m.id === active)
  const max = Math.max(...milestones.map((m) => m.commits))

  // Use live growth series if available, otherwise mock
  const growthData = liveData || mockGrowthSeries

  return (
    <Card className="p-6 lg:p-8">
      <SectionHeading
        eyebrow="When did it happen?"
        title="Software Evolution Timeline"
        subtitle="Each milestone marks a distinct phase of development"
      />

      {/* Repository Growth Chart (live data when available) */}
      <div className="h-40 mb-6 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6E62C4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6E62C4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E7F0' }}
              formatter={(v, n) => [v, n === 'commits' ? 'Commits' : 'Files']}
            />
            <Area type="monotone" dataKey="commits" stroke="#6E62C4" strokeWidth={2} fill="url(#commitGrad)" dot={false} />
            <Area type="monotone" dataKey="files" stroke="#3B9A7E" strokeWidth={1.5} fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Milestone navigator (always uses mock milestones for narrative) */}
      <div className="relative pt-6 pb-2">
        <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="absolute top-[52px] left-0 w-full h-3" aria-hidden>
          <defs>
            <linearGradient id="riverGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#C7C3EE" />
              <stop offset="50%" stopColor="#8A7FD3" />
              <stop offset="100%" stopColor="#4FAF93" />
            </linearGradient>
          </defs>
          <path d="M2,3 Q 20,0 35,3 T 65,3 T 98,3" stroke="url(#riverGrad)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-3 sm:grid-cols-6 gap-3">
          {milestones.map((m) => {
            const isActive = m.id === active
            const height = 8 + (m.commits / max) * 40
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className="flex flex-col items-center group focus:outline-none"
              >
                <div className="w-full flex items-end justify-center" style={{ height: 48 }}>
                  <motion.div
                    layout
                    className={`w-1.5 rounded-full ${isActive ? 'bg-primary-500' : 'bg-primary-200 group-hover:bg-primary-300'}`}
                    animate={{ height }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                </div>
                <motion.div
                  className={`mt-3 w-3 h-3 rounded-full border-2 ${isActive ? 'bg-primary-500 border-primary-500' : 'bg-card border-primary-300'}`}
                  animate={{ scale: isActive ? 1.15 : 1 }}
                />
                <p className={`mt-2 text-[13px] font-medium ${isActive ? 'text-ink' : 'text-ink-soft'}`}>{m.id}</p>
                <p className="text-[11px] text-ink-soft">{m.label}</p>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="mt-6 rounded-lg bg-bg border border-line p-5"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-display text-lg text-ink">
              {activeMilestone.id} — {activeMilestone.label}
            </h3>
            <span className="text-xs text-ink-soft flex items-center gap-1">
              <Calendar size={12} /> {activeMilestone.date}
            </span>
          </div>
          <p className="text-sm text-ink-soft mt-2 max-w-2xl">{activeMilestone.detail}</p>
          <div className="flex flex-wrap gap-6 mt-4">
            <Stat icon={GitCommit} label="commits" value={activeMilestone.commits} />
            <Stat icon={Users} label="developers" value={activeMilestone.developers} />
            <Stat icon={FileText} label="files modified" value={activeMilestone.files} />
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-primary-500" strokeWidth={1.75} />
      <span className="font-display text-base text-ink">{value}</span>
      <span className="text-xs text-ink-soft">{label}</span>
    </div>
  )
}
