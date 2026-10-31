import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { suggestedQuestions, mockAnswers } from '../../data/mockData.js'
import { useRepo } from '../../context/RepoContext.jsx'

export default function AskDevTimeAI({ open, onClose }) {
  const { data } = useRepo()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  // Build context-aware answers when real data is present
  const buildAnswer = (question) => {
    if (mockAnswers[question] && !data) return mockAnswers[question]

    const q = question.toLowerCase()
    const repo = data?.repository
    const hotspots = data?.hotspots || []
    const devs = data?.developers || []
    const commits = data?.recentCommits || []
    const repoName = repo?.url?.split('/').pop() || 'this repository'

    if (data) {
      if (q.includes('recent') || q.includes('changed')) {
        const top3 = commits.slice(0, 3).map(c => `"${c.message}" by ${c.author}`).join(', ')
        return top3
          ? `Recent activity in ${repoName}: ${top3}.`
          : `${repoName} has ${repo?.commits?.toLocaleString()} total commits. Check the Recent Commits panel for the latest changes.`
      }
      if (q.includes('hotspot') || q.includes('file')) {
        const high = hotspots.filter(h => h.risk === 'High').map(h => h.file)
        return high.length
          ? `High-risk hotspots in ${repoName}: ${high.join(', ')}. These files have the most churn and would benefit from refactoring attention.`
          : hotspots.length
            ? `Top changed files: ${hotspots.slice(0, 3).map(h => h.file).join(', ')}.`
            : 'Hotspot data is not available for this repository (requires git clone).'
      }
      if (q.includes('developer') || q.includes('who') || q.includes('author')) {
        const top = devs.slice(0, 3).map(d => `${d.name} (${d.commits} commits)`).join(', ')
        return top
          ? `Top contributors in ${repoName}: ${top}.`
          : `${repo?.developers} developers have contributed to ${repoName}.`
      }
      if (q.includes('phase') || q.includes('biggest') || q.includes('growth')) {
        return `${repoName} has been active for ${repo?.activeMonths} months since ${repo?.since}, growing to ${repo?.commits?.toLocaleString()} commits across ${repo?.files} files.`
      }
      // Generic fallback with real data
      return `${repoName} has ${repo?.commits?.toLocaleString() || '?'} commits, ${repo?.developers} contributors, and ${repo?.files} files tracked. It has been active for ${repo?.activeMonths} months.`
    }

    // No real data — use mock answers
    return mockAnswers[question] ||
      "That's a great question — based on this repository's history, activity has been steady with authentication and core routing as the main areas of focus."
  }

  const ask = (question) => {
    if (!question.trim()) return
    const answer = buildAnswer(question)
    setMessages((m) => [...m, { role: 'user', text: question }, { role: 'ai', text: answer }])
    setInput('')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/25 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-screen w-full max-w-sm bg-card border-l border-line z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-line">
              <h3 className="font-display text-lg text-ink flex items-center gap-1.5">
                <span className="text-primary-400">✦</span> Ask RepoScope AI
              </h3>
              <button onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {messages.length === 0 && (
                <div>
                  <p className="text-[13px] text-ink-soft mb-3">Try asking:</p>
                  <div className="flex flex-col gap-2">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => ask(q)}
                        className="text-left text-[13px] text-ink bg-bg border border-line rounded-lg px-3 py-2 hover:border-primary-300 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`text-[13px] rounded-lg px-3 py-2 max-w-[90%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary-500 text-white self-end'
                      : 'bg-bg text-ink self-start border border-line'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); ask(input) }}
              className="p-4 border-t border-line flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about this repository..."
                className="flex-1 bg-bg border border-line rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary-300"
              />
              <button type="submit" className="w-9 h-9 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors shrink-0">
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
