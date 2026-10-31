import EvolutionTimeline from '../components/dashboard/EvolutionTimeline.jsx'
import TimeTravelSlider from '../components/dashboard/TimeTravelSlider.jsx'
import ThenVsNow from '../components/dashboard/ThenVsNow.jsx'

export default function Timeline() {
  return (
    <div className="flex flex-col gap-5 pb-16">
      <div>
        <h1 className="font-display text-2xl text-ink">Timeline</h1>
        <p className="text-sm text-ink-soft mt-1">Trace how the repository moved from a first commit to where it stands today.</p>
      </div>
      <EvolutionTimeline />
      <TimeTravelSlider />
      <ThenVsNow />
    </div>
  )
}
