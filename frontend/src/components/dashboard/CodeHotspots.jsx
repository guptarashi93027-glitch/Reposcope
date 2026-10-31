import { useState } from 'react'
import { hotspots as mockHotspots } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { SectionHeading } from '../ui/Card.jsx'
import HotspotDetailDrawer from './HotspotDetailDrawer.jsx'

const riskStyles = {
  High: 'bg-coral-50 text-coral-500',
  Medium: 'bg-amber-50 text-amber-500',
  Low: 'bg-teal-50 text-teal-600',
}

export default function CodeHotspots({ liveData }) {
  const hotspots = liveData || mockHotspots
  const [selected, setSelected] = useState(null)

  return (
    <Card className="p-6 lg:p-8">
      <SectionHeading eyebrow="Where is the code changing?" title="Code Hotspots" />

      <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-3 pb-2 text-[11px] font-semibold tracking-wide text-ink-soft uppercase">
        <span>File</span>
        <span>Change Frequency</span>
        <span>Risk Level</span>
      </div>

      <div className="flex flex-col gap-1">
        {hotspots.map((h) => (
          <button
            key={h.file}
            onClick={() => setSelected(h)}
            className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto] gap-1 sm:gap-4 items-start sm:items-center text-left px-3 py-3 rounded-lg hover:bg-bg transition-colors border border-transparent hover:border-line"
          >
            <span className="font-mono text-[13px] text-ink break-all">{h.file}</span>
            <div className="flex items-center gap-2 sm:contents">
              <span className="text-[13px] text-ink-soft">{h.changes} changes</span>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full w-fit ${riskStyles[h.risk]}`}>
                {h.risk}
              </span>
            </div>
          </button>
        ))}
      </div>

      <HotspotDetailDrawer hotspot={selected} onClose={() => setSelected(null)} />
    </Card>
  )
}
