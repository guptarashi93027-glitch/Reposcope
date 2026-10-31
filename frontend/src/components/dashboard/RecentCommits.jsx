import { recentCommits as mockCommits, developers as mockDevelopers } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { SectionHeading } from '../ui/Card.jsx'

const PALETTE = ['#6E62C4','#4A729B','#3B9A7E','#C48431','#C15F4E','#8A7FD3','#5C87B0','#4FAF93']

function colorForAuthor(authorName, devList) {
  const found = devList.find(d => d.name === authorName)
  if (found?.color) return found.color
  // deterministic fallback by first char code
  return PALETTE[(authorName?.charCodeAt(0) || 0) % PALETTE.length]
}

function initialsForAuthor(authorName, devList) {
  const found = devList.find(d => d.name === authorName)
  if (found?.initials) return found.initials
  const parts = (authorName || '??').trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (authorName || '??').slice(0, 2).toUpperCase()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const diffDays = Math.round((new Date(dateStr) - Date.now()) / 86400000)
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffDays, 'day')
  } catch (_) {
    return dateStr
  }
}

export default function RecentCommits({ liveData, liveDevelopers }) {
  const commits = liveData || mockCommits
  // Use live developer list for avatar colors; fall back to mock list
  const devList  = liveDevelopers || mockDevelopers

  return (
    <Card className="p-6 lg:p-8">
      <SectionHeading
        eyebrow="What happened?"
        title="Recent Commits"
        action={<button className="text-[13px] font-medium text-primary-600 hover:text-primary-700">View All →</button>}
      />

      <div className="flex flex-col">
        {commits.map((c, idx) => (
          <div key={(c.hash || '') + idx} className="flex items-center gap-3 py-3 border-b border-line last:border-0 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
              style={{ backgroundColor: colorForAuthor(c.author, devList) }}
            >
              {initialsForAuthor(c.author, devList)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-ink truncate">{c.message}</p>
              <p className="text-[11px] text-ink-soft mt-0.5 truncate">
                <span className="font-mono">{c.hash}</span> · {c.author} · {c.time || formatDate(c.date)}
              </p>
            </div>
            <div className="text-[12px] font-mono shrink-0 hidden sm:block">
              <span className="text-teal-600">+{c.added}</span>{' '}
              <span className="text-coral-500">-{c.removed}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
