import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { repository as mockRepo } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { ExternalLink } from 'lucide-react'

export default function RepositoryHero({ liveData, dataSource = 'pydriller' }) {
  const navigate = useNavigate()
  const repo = liveData || mockRepo

  // Derive display name from URL or use the mock name
  const name = liveData
    ? (liveData.url || '').split('/').slice(-1)[0] || 'Repository'
    : mockRepo.name

  const fullName = liveData
    ? (liveData.url || '').replace('https://github.com/', '')
    : mockRepo.fullName

  const sparkData = (repo.sparkline || mockRepo.sparkline).map((v, i) => ({ i, v }))

  const stats = [
    { label: 'commits',       value: (repo.commits || 0).toLocaleString() },
    { label: 'developers',    value: repo.developers || 0 },
    { label: 'files',         value: repo.files || 0 },
    { label: 'months active', value: repo.activeMonths || 0 },
  ]

  return (
    <Card className="p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-full opacity-70 pointer-events-none hidden lg:block">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke="#C7C3EE" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {liveData ? (
            <span className="text-[11px] font-medium text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
              Live · {dataSource === 'github_api' ? 'GitHub API' : 'PyDriller'}
            </span>
          ) : (
            (mockRepo.tags || []).map((t) => (
              <span key={t} className="text-[11px] font-medium text-ink-soft bg-bg border border-line px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))
          )}
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl text-ink capitalize">{name}</h1>
            <p className="text-ink-soft mt-1 max-w-md">
              {liveData
                ? <a href={liveData.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">{fullName} <ExternalLink size={12} /></a>
                : mockRepo.description}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="shrink-0 bg-primary-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary-600 transition-colors"
          >
            New Analysis
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl text-ink leading-none">{s.value}</p>
              <p className="text-xs text-ink-soft mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
