import { useCallback, useEffect, useState } from 'react'

// '/' locally, '/<repo-name>/' on GitHub Pages (set by vite.config.js).
const BASE = import.meta.env.BASE_URL

/** Path inside the app, always starting with '/', with the deploy base removed. */
function appPath() {
  const { pathname } = window.location
  const inner = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '')
  return `/${inner}`
}

const fullPath = (to) => `${BASE}${to.replace(/^\//, '')}`

/** Minimal pushState router: enough for /, /host and /join/:code. */
export function useRoute() {
  const [path, setPath] = useState(appPath)

  useEffect(() => {
    const onPop = () => setPath(appPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (to === appPath()) return
    window.history[replace ? 'replaceState' : 'pushState']({}, '', fullPath(to))
    setPath(to)
    window.scrollTo(0, 0)
  }, [])

  return { path, navigate }
}

export function joinUrl(code) {
  return `${window.location.origin}${fullPath(`/join/${code}`)}`
}
