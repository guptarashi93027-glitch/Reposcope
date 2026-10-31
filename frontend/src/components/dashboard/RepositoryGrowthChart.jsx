import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { growthSeries } from '../../data/mockData.js'

export default function RepositoryGrowthChart({ height = 220 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={growthSeries} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6E62C4" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#6E62C4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E9F1" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7080' }} axisLine={false} tickLine={false} interval={1} />
          <YAxis tick={{ fontSize: 11, fill: '#6B7080' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid #E8E9F1', fontSize: 12 }}
            labelStyle={{ color: '#1B1E2B', fontWeight: 600 }}
          />
          <Area type="monotone" dataKey="commits" stroke="#6E62C4" strokeWidth={2} fill="url(#growthFill)" name="Commits" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
