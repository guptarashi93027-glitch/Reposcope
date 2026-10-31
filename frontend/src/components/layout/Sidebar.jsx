import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid, GitBranch, Users, Activity, Sparkles,
  Plus, GitCompare, Download, Share2, LogOut, Telescope,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { to: '/timeline', label: 'Timeline', icon: GitBranch },
  { to: '/developers', label: 'Developers', icon: Users },
  { to: '/code-health', label: 'Code Health', icon: Activity },
  { to: '/ai-insights', label: 'AI Insights', icon: Sparkles },
]

const quickActions = [
  { label: 'New Analysis', icon: Plus },
  { label: 'Compare Repos', icon: GitCompare },
  { label: 'Export Report', icon: Download },
  { label: 'Share Analysis', icon: Share2 },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    navigate('/')
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-[272px] shrink-0 bg-card border-r border-line
        flex flex-col transition-transform duration-300 ease-out
        ${open ? 'translate-x-0 shadow-lift' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo / Header */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
                <Telescope size={16} className="text-white" strokeWidth={1.75} />
              </div>
              <span className="font-display text-xl tracking-tight text-ink">RepoScope</span>
            </div>
            <p className="text-[11px] text-ink-soft/70 mt-1 ml-10 font-display italic">"Your Code. Through Time."</p>
          </div>
          {/* Close btn on mobile */}
          <button
            className="lg:hidden text-ink-soft hover:text-ink p-1 rounded-md hover:bg-bg transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 mb-2">
          <div className="h-px bg-line" />
        </div>

        {/* Navigation */}
        <nav className="px-3 flex flex-col gap-0.5">
          <p className="px-3 text-[10px] font-semibold tracking-[0.12em] text-ink-soft/60 uppercase mb-1">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150
                ${isActive
                  ? 'bg-primary-500 text-white font-medium shadow-soft'
                  : 'text-ink-soft hover:bg-primary-50 hover:text-primary-700'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.75} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="px-3 mt-5">
          <p className="px-3 text-[10px] font-semibold tracking-[0.12em] text-ink-soft/60 uppercase mb-1">
            Quick actions
          </p>
          {quickActions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => label === 'New Analysis' && navigate('/')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-ink-soft hover:bg-bg hover:text-ink transition-all duration-150"
            >
              <Icon size={14} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>

        {/* Time Travel Card */}
        <div className="mx-3 mt-5 rounded-xl bg-gradient-to-br from-primary-500/10 to-teal-100 border border-primary-200/60 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-500/5 rounded-full -translate-y-6 translate-x-6" />
          <p className="text-[11px] font-semibold tracking-[0.1em] text-primary-600 uppercase">Time Travel</p>
          <p className="text-[12px] text-ink-soft mt-1 leading-snug">
            Navigate through the history of your repository
          </p>
          <TravelerGlyph />
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Start Time Travel <span aria-hidden>→</span>
          </NavLink>
        </div>

        {/* User & Logout */}
        <div className="mt-auto px-3 pb-4 pt-3 border-t border-line">
          {/* User row */}
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-[11px] font-semibold flex items-center justify-center shadow-soft shrink-0">
              RS
            </div>
            <div className="leading-tight min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink truncate">Rashi</p>
              <p className="text-[11px] text-ink-soft">Workspace owner</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-coral-500 hover:bg-coral-50 hover:text-coral-600 transition-all duration-150 font-medium"
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Logout confirm modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-card rounded-2xl shadow-lift border border-line p-6 max-w-xs w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-10 rounded-full bg-coral-50 flex items-center justify-center mb-3">
                <LogOut size={18} className="text-coral-500" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg text-ink font-semibold">Sign out?</h3>
              <p className="text-sm text-ink-soft mt-1">You'll be returned to the RepoScope home screen.</p>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-line text-ink-soft hover:bg-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-coral-500 text-white hover:bg-coral-600 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function TravelerGlyph() {
  return (
    <svg viewBox="0 0 120 40" className="w-full h-7 mt-2" aria-hidden>
      <path d="M2 30 Q30 8 60 20 T118 10" stroke="#A79FE1" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
      <motion.circle
        r="4"
        fill="#6E62C4"
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ offsetPath: "path('M2 30 Q30 8 60 20 T118 10')" }}
      />
    </svg>
  )
}
