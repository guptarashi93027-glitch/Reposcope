import ProjectStory from '../components/dashboard/ProjectStory.jsx'
import { suggestedQuestions, mockAnswers } from '../data/mockData.js'
import Card from '../components/ui/Card.jsx'
import { useRepo } from '../context/RepoContext.jsx'

export default function AIInsights() {
  const { data } = useRepo()

  // Build context-aware answers when real data is present
  const getAnswer = (q) => {
    const repo = data?.repository
    const hotspots = data?.hotspots || []
    const devs = data?.developers || []
    const commits = data?.recentCommits || []
    const repoName = repo?.url?.split('/').pop() || null

    if (!data) return mockAnswers[q]

    const ql = q.toLowerCase()
    if (ql.includes('recent') || ql.includes('changed')) {
      const top3 = commits.slice(0, 3).map(c => `"${c.message}" by ${c.author}`).join('; ')
      return top3 ? `Recent commits in ${repoName}: ${top3}.` : `${repoName} has ${repo?.commits?.toLocaleString()} total commits.`
    }
    if (ql.includes('hotspot') || ql.includes('file')) {
      const high = hotspots.filter(h => h.risk === 'High').map(h => h.file)
      return high.length
        ? `High-risk files in ${repoName}: ${high.join(', ')}. These have the most churn.`
        : hotspots.length
          ? `Top files: ${hotspots.slice(0, 3).map(h => h.file).join(', ')}.`
          : 'Hotspot data requires a full git clone analysis.'
    }
    if (ql.includes('developer') || ql.includes('who')) {
      const top = devs.slice(0, 3).map(d => `${d.name} (${d.commits} commits)`).join(', ')
      return top ? `Top contributors: ${top}.` : `${repo?.developers} developers contributed.`
    }
    if (ql.includes('phase') || ql.includes('biggest')) {
      return `${repoName} has been active for ${repo?.activeMonths} months since ${repo?.since}, reaching ${repo?.commits?.toLocaleString()} commits.`
    }
    return `${repoName}: ${repo?.commits?.toLocaleString()} commits · ${repo?.developers} developers · ${repo?.files} files · ${repo?.activeMonths} months active.`
  }

  return (
    <div className="flex flex-col gap-5 pb-16">
      <div>
        <h1 className="font-display text-2xl text-ink">AI Insights</h1>
        <p className="text-sm text-ink-soft mt-1">A generated narrative of how this repository evolved, and answers to common questions.</p>
      </div>
      <ProjectStory />
      <Card className="p-6 lg:p-8">
        <h2 className="font-display text-lg text-ink mb-4">Common questions</h2>
        <div className="flex flex-col gap-3">
          {suggestedQuestions.map((q) => (
            <div key={q} className="border border-line rounded-lg p-4">
              <p className="text-sm font-medium text-ink mb-1.5">{q}</p>
              <p className="text-[13px] text-ink-soft leading-relaxed">{getAnswer(q)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
