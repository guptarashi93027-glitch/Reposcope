/**
 * RepoScope API client
 * Talks to the Flask + PyDriller backend at http://localhost:5000
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/** POST /api/analyze — mine a GitHub repo */
export async function analyzeRepo(url) {
  const res = await fetch(`${BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

/** GET /api/health — liveness check */
export async function checkHealth() {
  const res = await fetch(`${BASE}/api/health`)
  return res.ok
}
