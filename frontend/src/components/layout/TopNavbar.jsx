import { GitFork, Search, Bell, Menu, CheckCircle2, LogOut, Telescope, X } from 'lucide-react'
import { repository } from '../../data/mockData.js'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useRepo } from '../../context/RepoContext.jsx'
export default function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate()
  const { data, status, repoUrl } = useRepo()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const menuRef = useRef(null)

  // Derive display info from live data or fall back to mock
  const liveRepoName = data?.repository?.url
    ? data.repository.url.replace('https://github.com/', '')
    : null
  const displayName = liveRepoName || repository.fullName
  const isLive = status === 'ready'

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur-md border-b border-line">
      <div className="h-14 px-4 lg:px-6 flex items-center gap-3">

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-card transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Brand (mobile only) */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Telescope size={13} className="text-white" strokeWidth={1.75} />
          </div>
          <span className="font-display text-base font-semibold text-ink">RepoScope</span>
        </div>

        {/* Repo info (desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          <GitFork size={15} className="text-ink-soft" strokeWidth={1.75} />
          <span className="text-sm font-medium text-ink truncate max-w-[200px]">{displayName}</span>
          {isLive ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} strokeWidth={2.5} /> Live
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} strokeWidth={2.5} /> {repository.status}
            </span>
          )}
        </div>

        {/* Search bar (desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-sm ml-2">
          <div className="w-full flex items-center gap-2 bg-card border border-line rounded-xl px-3 py-1.5 text-ink-soft focus-within:border-primary-300 focus-within:ring-1 focus-within:ring-primary-200 transition-all">
            <Search size={14} strokeWidth={1.75} />
            <input
              placeholder="Search commits, files, authors..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-ink-soft/60"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5">

          {/* Mobile search toggle */}
          <button
            className="md:hidden text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-card transition-colors"
            onClick={() => setSearchOpen(s => !s)}
            aria-label="Search"
          >
            {searchOpen ? <X size={18} strokeWidth={1.75} /> : <Search size={18} strokeWidth={1.75} />}
          </button>

          {/* Notifications */}
          <button
            className="relative text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-card transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.75} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary-500 rounded-full" />
          </button>

          {/* User avatar + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(u => !u)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-card transition-colors"
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-[11px] font-semibold flex items-center justify-center shadow-soft">
                RS
              </div>
              <span className="hidden sm:block text-[13px] font-medium text-ink">Rashi</span>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-card border border-line rounded-2xl shadow-lift overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-line">
                    <p className="text-sm font-semibold text-ink">Rashi</p>
                    <p className="text-xs text-ink-soft">Workspace owner</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-coral-500 hover:bg-coral-50 transition-colors font-medium"
                    >
                      <LogOut size={14} strokeWidth={1.75} />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search bar (expandable) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden border-t border-line"
          >
            <div className="px-4 py-2.5">
              <div className="w-full flex items-center gap-2 bg-card border border-line rounded-xl px-3 py-2 text-ink-soft focus-within:border-primary-300 transition-all">
                <Search size={14} strokeWidth={1.75} />
                <input
                  autoFocus
                  placeholder="Search commits, files, authors..."
                  className="bg-transparent text-sm outline-none w-full placeholder:text-ink-soft/60"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
