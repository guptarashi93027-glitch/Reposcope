import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopNavbar from './TopNavbar.jsx'
import AskDevTimeAI from '../dashboard/AskDevTimeAI.jsx'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [askOpen, setAskOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay to push content right of sidebar on desktop */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-0">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1400px] mx-auto w-full">
          <Outlet context={{ openAsk: () => setAskOpen(true) }} />
        </main>
      </div>

      {/* AI Ask FAB */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setAskOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 bg-ink text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-lift hover:bg-ink/90 transition-colors text-sm font-medium"
        aria-label="Ask RepoScope AI"
      >
        <Sparkles size={15} className="text-primary-300" />
        <span className="hidden sm:inline">Ask RepoScope AI</span>
        <span className="sm:hidden">Ask AI</span>
      </motion.button>

      <AskDevTimeAI open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  )
}
