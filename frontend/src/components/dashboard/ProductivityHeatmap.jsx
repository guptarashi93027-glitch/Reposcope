import { useState } from 'react'
import { heatmap } from '../../data/mockData.js'
import Card from '../ui/Card.jsx'
import { SectionHeading } from '../ui/Card.jsx'

const intensityColors = ['#EEF0F4', '#CFEEE3', '#9AD9C1', '#4FAF93', '#2E7C65']

export default function ProductivityHeatmap() {
  const [hover, setHover] = useState(null)

  return (
    <Card className="p-6 lg:p-8">
      <SectionHeading
        eyebrow="When is development most active?"
        title="Productivity Heatmap"
      />

      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="flex gap-[3px]">
            <div className="w-8" />
            {heatmap[0].weeks.map((w) => (
              <div key={w.week} className="w-4" />
            ))}
          </div>
          {heatmap.map((row) => (
            <div key={row.day} className="flex items-center gap-[3px] mb-[3px]">
              <div className="w-8 text-[11px] text-ink-soft">{row.day}</div>
              {row.weeks.map((cell) => (
                <div
                  key={cell.week}
                  onMouseEnter={() => setHover({ day: row.day, ...cell })}
                  onMouseLeave={() => setHover(null)}
                  className="w-4 h-4 rounded-[3px] cursor-pointer transition-transform hover:scale-125"
                  style={{ backgroundColor: intensityColors[cell.intensity] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
          Less
          {intensityColors.map((c) => (
            <span key={c} className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: c }} />
          ))}
          More
        </div>

        <div className="text-[13px] text-ink-soft min-h-[20px]">
          {hover ? (
            <span>
              <span className="font-medium text-ink">{hover.day}, week {hover.week + 1}</span>
              {' — '}{hover.commits} commits · {hover.developers} developers · {hover.files} files changed
            </span>
          ) : (
            'Hover a cell to see details'
          )}
        </div>
      </div>
    </Card>
  )
}
