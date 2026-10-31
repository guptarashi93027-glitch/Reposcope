import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { aiStory } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { useOutletContext } from 'react-router-dom'
import { useRepo } from '../../context/RepoContext.jsx'

function buildLiveStory(data) {
  const repo = data?.repository
  const devs = data?.developers || []
  const hotspots = data?.hotspots || []
  const repoName = repo?.url?.split('/').pop() || 'This repository'
  const topDev = devs[0]
  const highRisk = hotspots.filter(h => h.risk === 'High').map(h => h.file)

  const body = [
    `${repoName} has accumulated ${repo?.commits?.toLocaleString() ?? '?'} commits across ${repo?.files ?? '?'} files, contributed by ${repo?.developers ?? '?'} developers over ${repo?.activeMonths ?? '?'} months of active development since ${repo?.since ?? 'inception'}.`,
    topDev
      ? `${topDev.name} leads contributions with ${topDev.commits} commits (${topDev.pct}% of total). ${devs.length > 1 ? `The top ${Math.min(3, devs.length)} contributors collectively account for ${devs.slice(0, 3).reduce((s, d) => s + d.pct, 0).toFixed(1)}% of all commits.` : ''}`
      : 'Contributor data is being processed.',
  ]

  const keyInsight = highRisk.length
    ? `${highRisk.join(' and ')} ${highRisk.length > 1 ? 'are' : 'is'} flagged as high-risk — ${highRisk.length > 1 ? 'these files have' : 'this file has'} the most churn and may benefit from refactoring or better test coverage.`
    : hotspots.length
      ? `${hotspots[0].file} is the most frequently modified file with ${hotspots[0].changes} changes — keep an eye on coupling and test coverage here.`
      : `The codebase spans ${repo?.files ?? '?'} files. Run a full git clone analysis to reveal hotspot and risk data.`

  return { body, keyInsight }
}

export default function ProjectStory() {
  const [spin, setSpin] = useState(false)
  const ctx = useOutletContext?.() ?? {}
  const { data } = useRepo()

  const story = data ? buildLiveStory(data) : aiStory

  const regenerate = () => {
    setSpin(true)
    setTimeout(() => setSpin(false), 700)
  }

  return (
    <Card className="p-6 lg:p-8 relative overflow-hidden bg-gradient-to-br from-card to-primary-50/40">
      <AIGlyph />
      <p className="text-[11px] font-semibold tracking-[0.12em] text-primary-500 uppercase mb-1">
        What does all this activity mean?
      </p>
      <h2 className="font-display text-xl text-ink mb-4 flex items-center gap-1.5">
        <span className="text-primary-400">✦</span> AI Project Story
        {data && <span className="text-[11px] font-sans font-medium text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full ml-2">Live</span>}
      </h2>

      <div className="space-y-3 max-w-2xl">
        {story.body.map((p, i) => (
          <p key={i} className="text-sm text-ink-soft leading-relaxed">{p}</p>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-card/70 border border-primary-100 p-4 max-w-2xl">
        <p className="text-[11px] font-semibold tracking-wide text-primary-600 uppercase mb-1.5">Key Insight</p>
        <p className="text-[13px] text-ink leading-relaxed">{story.keyInsight}</p>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          onClick={regenerate}
          className="flex items-center gap-1.5 text-sm font-medium text-ink bg-card border border-line px-4 py-2 rounded-lg hover:bg-bg transition-colors"
        >
          <motion.span animate={{ rotate: spin ? 360 : 0 }} transition={{ duration: 0.6 }}>
            <RefreshCw size={14} />
          </motion.span>
          Regenerate with AI
        </button>
        <button
          onClick={() => ctx.openAsk?.()}
          className="text-sm font-medium text-white bg-primary-500 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Ask RepoScope AI
        </button>
      </div>
    </Card>
  )
}

function AIGlyph() {
  return (
    <svg className="absolute -right-4 -top-4 w-28 h-28 opacity-60" viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="34" fill="#E4E2F8" />
      <circle cx="38" cy="44" r="4" fill="#6E62C4" />
      <circle cx="62" cy="44" r="4" fill="#6E62C4" />
      <path d="M36 62 Q50 72 64 62" stroke="#6E62C4" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
