import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, Users, Activity, ArrowRight, Telescope, Star, Zap, Shield, AlertCircle } from 'lucide-react'
import { useRepo } from '../context/RepoContext.jsx'

const loadingSteps = [
  'Connecting to repository...',
  'Reconstructing commit history...',
  'Mapping developers...',
  'Detecting hotspots...',
  'Building evolution timeline...',
  'Generating insights...',
]

const features = [
  {
    icon: GitBranch,
    label: 'Git History',
    desc: 'Every commit, mapped across time',
    color: 'from-primary-400 to-primary-600',
    bg: 'bg-primary-50',
  },
  {
    icon: Users,
    label: 'Developer Analytics',
    desc: 'Who shaped which part of the code',
    color: 'from-teal-400 to-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: Activity,
    label: 'Code Intelligence',
    desc: 'Hotspots, risk, and where to look next',
    color: 'from-amber-400 to-amber-500',
    bg: 'bg-amber-50',
  },
]

const stats = [
  { value: '10M+', label: 'Commits Analyzed', icon: GitBranch },
  { value: '50K+', label: 'Repositories', icon: Star },
  { value: '99.9%', label: 'Uptime', icon: Shield },
  { value: '<1s', label: 'Analysis Time', icon: Zap },
]

export default function Landing() {
  const navigate = useNavigate()
  const { analyze } = useRepo()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [apiError, setApiError] = useState('')

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!url.trim()) return

    setLoading(true)
    setStep(0)

    // Animate loading steps while the backend is mining the repo
    let tickCount = 0
    const ticker = setInterval(() => {
      tickCount += 1
      setStep((prev) => prev + 1)
      if (tickCount >= loadingSteps.length) clearInterval(ticker)
    }, 600)

    try {
      await analyze(url.trim())
      clearInterval(ticker)
      navigate('/dashboard')
    } catch (err) {
      clearInterval(ticker)
      setLoading(false)
      setApiError(err?.message || 'Analysis failed. Check the URL and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-72 h-72 bg-teal-50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-50/80 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-5 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
            <Telescope size={18} className="text-white" strokeWidth={1.75} />
          </div>
          <div>
            <span className="font-display text-xl font-semibold text-ink">RepoScope</span>
            <span className="hidden sm:inline-block text-[11px] font-semibold tracking-[0.12em] text-primary-500 uppercase ml-2 align-middle">Beta</span>
          </div>
        </div>
        <nav className="hidden sm:flex items-center gap-1">
          <a href="#features" className="px-3 py-1.5 text-sm text-ink-soft hover:text-ink rounded-lg hover:bg-card transition-colors">Features</a>
          <button
            onClick={() => navigate('/dashboard')}
            className="ml-2 px-4 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-soft"
          >
            Open Demo
          </button>
        </nav>
      </header>

      {/* Main hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-2xl w-full text-center">
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-600 text-[12px] font-semibold px-3 py-1 rounded-full mb-5"
                >
                  <Zap size={11} className="fill-primary-500" />
                  Powered by PyDriller — now in Beta
                </motion.div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.1] tracking-tight">
                  Travel Through <br className="hidden sm:block" />
                  <span className="text-primary-500">Your Codebase.</span>
                </h1>
                <p className="text-ink-soft text-base sm:text-lg mt-4 max-w-md mx-auto leading-relaxed">
                  Turn Git history into a visual story of how your software evolved. Understand every commit, every author, every change.
                </p>

                {/* Input form */}
                <form onSubmit={handleAnalyze} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste GitHub repository URL..."
                    className="flex-1 bg-card border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-ink-soft/60 shadow-soft min-h-[48px]"
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    type="submit"
                    disabled={!url.trim()}
                    className="flex items-center justify-center gap-2 bg-primary-500 text-white text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-primary-600 transition-colors whitespace-nowrap shadow-lift disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                  >
                    Analyze <ArrowRight size={15} />
                  </motion.button>
                </form>

                {/* Error banner */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl max-w-xl mx-auto"
                  >
                    <AlertCircle size={15} />
                    {apiError}
                  </motion.div>
                )}

                <p className="text-xs text-ink-soft/60 mt-3">
                  Try it with any public GitHub repository
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-xl mx-auto">
                  {stats.map(({ value, label }) => (
                    <div key={label} className="bg-card border border-line rounded-xl p-3 text-center">
                      <p className="font-display text-xl font-semibold text-ink">{value}</p>
                      <p className="text-[11px] text-ink-soft mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div id="features" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-left">
                  {features.map(({ icon: Icon, label, desc, color, bg }) => (
                    <motion.div
                      key={label}
                      whileHover={{ y: -2 }}
                      className="bg-card border border-line rounded-2xl p-4 shadow-soft"
                    >
                      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                        <div className={`w-5 h-5 bg-gradient-to-br ${color} rounded-md flex items-center justify-center`}>
                          <Icon size={11} className="text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-ink">{label}</p>
                      <p className="text-[12px] text-ink-soft mt-1 leading-snug">{desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 rounded-full border-2 border-primary-100 border-t-primary-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Telescope size={20} className="text-primary-500" strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="font-display text-xl text-ink mb-5">Analyzing your repository…</h2>
                <p className="text-xs text-ink-soft mb-5">This may take a minute for large repos</p>
                <div className="flex flex-col gap-2.5 text-left w-full max-w-xs">
                  {loadingSteps.map((s, i) => (
                    <motion.p
                      key={s}
                      initial={{ opacity: 0.25 }}
                      animate={{ opacity: i < step ? 1 : 0.25 }}
                      className={`text-sm flex items-center gap-2 ${i < step ? 'text-ink' : 'text-ink-soft'}`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                        i < step ? 'bg-teal-100 text-teal-600' : 'bg-line text-ink-soft/50'
                      }`}>
                        {i < step ? '✓' : (i + 1)}
                      </span>
                      {s}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 py-5 border-t border-line text-center">
        <p className="text-xs text-ink-soft/60">
          © 2025 RepoScope · Built with ♥ for developers
        </p>
      </footer>
    </div>
  )
}
