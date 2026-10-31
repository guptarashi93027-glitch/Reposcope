import { useRepo } from '../context/RepoContext.jsx'
import DeveloperObservatory from '../components/dashboard/DeveloperObservatory.jsx'
import RecentCommits from '../components/dashboard/RecentCommits.jsx'
import { developers as mockDevelopers } from '../data/mockData.js'
import Card from '../components/ui/Card.jsx'

const PALETTE = ['#6E62C4','#4A729B','#3B9A7E','#C48431','#C15F4E','#8A7FD3','#5C87B0','#4FAF93']

export default function Developers() {
  const { data, status } = useRepo()

  // Use live PyDriller data when available, fall back to mock
  const developers = data?.developers || mockDevelopers

  return (
    <div className="flex flex-col gap-5 pb-16">
      <div>
        <h1 className="font-display text-2xl text-ink">Developers</h1>
        <p className="text-sm text-ink-soft mt-1">
          Contribution patterns across everyone who has worked on this repository.
        </p>
        {/* Live data badge */}
        {status === 'ready' && data?.stats && (
          <p className="text-xs text-teal-600 mt-1 font-medium">
            ✓ Live data · {data.stats.humanDevelopers} unique contributors
            {data.stats.botAccounts > 0 && ` (${data.stats.botAccounts} bot${data.stats.botAccounts > 1 ? 's' : ''} excluded)`}
          </p>
        )}
        {status === 'idle' && (
          <p className="text-xs text-amber-500 mt-1">Showing demo data — analyze a real repo from the <a href="/" className="underline">home page</a></p>
        )}
      </div>

      {/* Developer grid cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {developers.map((d, idx) => (
          <Card key={d.name + idx} className="p-4 flex flex-col items-center text-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold text-white mb-2"
              style={{ backgroundColor: d.color || PALETTE[idx % PALETTE.length] }}
            >
              {d.initials}
            </div>
            <p className="text-sm font-medium text-ink">{d.name}</p>
            <p className="text-[11px] text-ink-soft mt-0.5">{d.commits} commits</p>
            {d.pct !== undefined && (
              <p className="text-[10px] text-ink-soft/70 mt-0.5">{d.pct}%</p>
            )}
          </Card>
        ))}
      </div>

      {/* Observatory + Recent Commits — pass live data */}
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <DeveloperObservatory liveData={data?.developers} />
        <RecentCommits liveData={data?.recentCommits} liveDevelopers={data?.developers} />
      </div>
    </div>
  )
}
