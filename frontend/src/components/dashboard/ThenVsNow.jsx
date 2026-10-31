import { thenVsNow } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { SectionHeading } from '../ui/Card.jsx'
import RepositoryGrowthChart from './RepositoryGrowthChart.jsx'

const rows = [
  { key: 'commits', label: 'Commits' },
  { key: 'developers', label: 'Developers' },
  { key: 'files', label: 'Files' },
  { key: 'hotspots', label: 'Hotspots' },
  { key: 'architecture', label: 'Architecture' },
]

export default function ThenVsNow() {
  return (
    <Card className="p-6 lg:p-8">
      <SectionHeading eyebrow="How much has the project evolved?" title="Then vs Now" />

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
        <div>
          <div className="grid grid-cols-3 text-[11px] font-semibold tracking-wide text-ink-soft uppercase pb-2 border-b border-line">
            <span></span>
            <span>Then</span>
            <span>Now</span>
          </div>
          {rows.map((r) => (
            <div key={r.key} className="grid grid-cols-3 items-center py-3 border-b border-line last:border-0">
              <span className="text-[13px] text-ink-soft">{r.label}</span>
              <span className="font-display text-base text-ink-soft">{thenVsNow.then[r.key]}</span>
              <span className="font-display text-base text-ink">{thenVsNow.now[r.key]}</span>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(thenVsNow.growth).map(([k, v]) => (
              <span key={k} className="text-[11px] font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                {k} {v}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-bg rounded-lg border border-line p-4">
          <p className="text-[13px] font-medium text-ink mb-2">Repository Growth</p>
          <RepositoryGrowthChart height={200} />
        </div>
      </div>
    </Card>
  )
}
