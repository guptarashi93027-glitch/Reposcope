import { useRepo } from '../context/RepoContext.jsx'
import RepositoryHero from '../components/dashboard/RepositoryHero.jsx'
import ProjectPulse from '../components/dashboard/ProjectPulse.jsx'
import EvolutionTimeline from '../components/dashboard/EvolutionTimeline.jsx'
import ProductivityHeatmap from '../components/dashboard/ProductivityHeatmap.jsx'
import DeveloperObservatory from '../components/dashboard/DeveloperObservatory.jsx'
import CodeHotspots from '../components/dashboard/CodeHotspots.jsx'
import RecentCommits from '../components/dashboard/RecentCommits.jsx'
import ThenVsNow from '../components/dashboard/ThenVsNow.jsx'
import ProjectStory from '../components/dashboard/ProjectStory.jsx'
import TimeTravelSlider from '../components/dashboard/TimeTravelSlider.jsx'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const { data, status, error, repoUrl } = useRepo()

  return (
    <div className="flex flex-col gap-5 pb-16">
      {/* Status banners */}
      {status === 'loading' && (
        <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 text-sm px-4 py-3 rounded-xl">
          <Loader2 size={15} className="animate-spin shrink-0" />
          Mining <span className="font-medium truncate">{repoUrl}</span> — this may take a minute…
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={15} className="shrink-0" />
          {error} — showing demo data below.
        </div>
      )}
      {status === 'idle' && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
          Showing demo data. Go to the <a href="/" className="underline font-medium">home page</a> to analyze a real repository.
        </div>
      )}
      {status === 'ready' && data?.source === 'github_api' && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={15} className="shrink-0" />
          Using GitHub API (git clone was unavailable) — developer &amp; commit data is live, but hotspot analysis requires git clone.
        </div>
      )}
      {status === 'ready' && data?.warning && data?.source !== 'github_api' && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-600 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={15} className="shrink-0" />
          {data.warning}
        </div>
      )}

      {/* Dashboard sections — each component reads live data from context or falls back to mock */}
      <RepositoryHero liveData={data?.repository} dataSource={data?.source} />
      <ProjectPulse liveData={data?.pulse} liveDevelopers={data?.developers} />
      <EvolutionTimeline liveData={data?.growthSeries} />

      <div className="grid lg:grid-cols-2 gap-5">
        <ProductivityHeatmap />
        <DeveloperObservatory liveData={data?.developers} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <CodeHotspots liveData={data?.hotspots} />
        <RecentCommits liveData={data?.recentCommits} liveDevelopers={data?.developers} />
      </div>

      <ThenVsNow />
      <TimeTravelSlider />
      <ProjectStory />
    </div>
  )
}
