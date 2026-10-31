import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { GitCommit, Users, FileText, Flame, Clock } from 'lucide-react'
import { pulse as mockPulse, developers as mockDevelopers } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'

function MetricCard({ icon: Icon, label, value, sub, subTone = 'text-ink-soft', accent, children }) {
  return (
    <Card className="p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon size={15} strokeWidth={1.75} />
        </div>
      </div>
      <p className="font-display text-2xl text-ink leading-none">{value}</p>
      <p className="text-xs text-ink-soft mt-1.5">{label}</p>
      {children}
      {sub && <p className={`text-[12px] mt-2 ${subTone}`}>{sub}</p>}
    </Card>
  )
}

export default function ProjectPulse({ liveData, liveDevelopers }) {
  const pulse = liveData || mockPulse
  const developers = liveDevelopers || mockDevelopers

  const trend = pulse?.commits?.trend || mockPulse.commits.trend
  const sparkData = trend.map((v, i) => ({ i, v }))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <MetricCard
        icon={GitCommit}
        label="Commits"
        value={(pulse?.commits?.value ?? mockPulse.commits.value).toLocaleString()}
        sub={pulse?.commits?.delta ? `${pulse.commits.delta} vs last month` : undefined}
        subTone="text-teal-600"
        accent="bg-primary-50 text-primary-600"
      >
        <div className="h-8 -mx-1 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="v" stroke="#6E62C4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </MetricCard>

      <MetricCard
        icon={Users}
        label="Developers"
        value={pulse?.developers?.value ?? mockPulse.developers.value}
        sub={`${pulse?.developers?.activeRecently ?? mockPulse.developers.activeRecently} active recently`}
        accent="bg-blue-400/10 text-blue-500"
      >
        <div className="flex -space-x-2 mt-2">
          {developers.slice(0, 4).map((d) => (
            <div
              key={d.name}
              title={d.name}
              className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-semibold text-white"
              style={{ backgroundColor: d.color }}
            >
              {d.initials}
            </div>
          ))}
        </div>
      </MetricCard>

      <MetricCard
        icon={FileText}
        label="Files"
        value={pulse?.files?.value ?? mockPulse.files.value}
        sub={`${pulse?.files?.modifiedThisMonth ?? mockPulse.files.modifiedThisMonth} modified this month`}
        accent="bg-teal-50 text-teal-600"
      />

      <MetricCard
        icon={Flame}
        label="Hotspots"
        value={pulse?.hotspots?.value ?? mockPulse.hotspots.value}
        sub={`${pulse?.hotspots?.highRisk ?? mockPulse.hotspots.highRisk} high-risk`}
        subTone="text-coral-500"
        accent="bg-coral-50 text-coral-500"
      />

      <MetricCard
        icon={Clock}
        label="Active Age"
        value={pulse?.activeAge?.value ?? mockPulse.activeAge.value}
        sub={`Since ${pulse?.activeAge?.since ?? mockPulse.activeAge.since}`}
        accent="bg-amber-50 text-amber-500"
      />
    </div>
  )
}
