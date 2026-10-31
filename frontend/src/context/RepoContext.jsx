/**
 * RepoContext — global store for mined repository data.
 *
 * Components read from `useRepo()`.
 * The Landing page calls `analyze(url)` to kick off mining.
 *
 * While `status === 'loading'` the dashboard shows skeletons.
 * While `status === 'idle'`  the dashboard falls back to mock data.
 * While `status === 'error'` a banner is shown.
 */

import { createContext, useContext, useState, useCallback } from 'react'
import { analyzeRepo } from '../api/repoApi.js'

const RepoContext = createContext(null)

export function RepoProvider({ children }) {
  const [data, setData]     = useState(null)   // mined payload from backend
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError]   = useState(null)
  const [repoUrl, setRepoUrl] = useState('')

  const analyze = useCallback(async (url) => {
    setStatus('loading')
    setError(null)
    setRepoUrl(url)
    try {
      const payload = await analyzeRepo(url)
      setData(payload)
      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  return (
    <RepoContext.Provider value={{ data, status, error, repoUrl, analyze }}>
      {children}
    </RepoContext.Provider>
  )
}

export function useRepo() {
  const ctx = useContext(RepoContext)
  if (!ctx) throw new Error('useRepo must be used inside <RepoProvider>')
  return ctx
}
