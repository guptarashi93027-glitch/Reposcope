import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import AppShell from './components/layout/AppShell.jsx'

// Lazy-load heavy dashboard pages so the initial bundle stays small
const Dashboard  = lazy(() => import('./pages/Dashboard.jsx'))
const Timeline   = lazy(() => import('./pages/Timeline.jsx'))
const Developers = lazy(() => import('./pages/Developers.jsx'))
const CodeHealth = lazy(() => import('./pages/CodeHealth.jsx'))
const AIInsights = lazy(() => import('./pages/AIInsights.jsx'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 rounded-full border-2 border-primary-100 border-t-primary-500 animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Suspense fallback={<PageFallback />}><Dashboard /></Suspense>} />
        <Route path="/timeline"  element={<Suspense fallback={<PageFallback />}><Timeline /></Suspense>} />
        <Route path="/developers" element={<Suspense fallback={<PageFallback />}><Developers /></Suspense>} />
        <Route path="/code-health" element={<Suspense fallback={<PageFallback />}><CodeHealth /></Suspense>} />
        <Route path="/ai-insights" element={<Suspense fallback={<PageFallback />}><AIInsights /></Suspense>} />
      </Route>
    </Routes>
  )
}
