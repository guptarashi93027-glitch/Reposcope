import { useRepo } from '../context/RepoContext.jsx'
import CodeHotspots from '../components/dashboard/CodeHotspots.jsx'
import ProductivityHeatmap from '../components/dashboard/ProductivityHeatmap.jsx'

export default function CodeHealth() {
  const { data } = useRepo()

  return (
    <div className="flex flex-col gap-5 pb-16">
      <div>
        <h1 className="font-display text-2xl text-ink">Code Health</h1>
        <p className="text-sm text-ink-soft mt-1">Where the codebase is under the most churn, and when work tends to happen.</p>
      </div>
      <CodeHotspots liveData={data?.hotspots} />
      <ProductivityHeatmap />
    </div>
  )
}
