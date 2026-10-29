import Landing from './Landing.jsx'
import HostApp from './host/HostApp.jsx'
import PlayerApp from './player/PlayerApp.jsx'
import NotConfigured from './NotConfigured.jsx'
import { useRoute } from './lib/router.js'
import { isConfigured } from './lib/firebase.js'

/**
 * Surfaces, switched by URL:
 *   /                   Landing
 *   /host               Host: quiz library (Google sign-in)
 *   /host/edit/:id      Host: quiz editor
 *   /host/room/:code    Host: running room (projector)
 *   /join, /join/:code  Player (the QR link pre-fills the code)
 */
export default function App() {
  const { path, navigate } = useRoute()

  if (path === '/') return <Landing navigate={navigate} />
  if (!isConfigured) return <NotConfigured navigate={navigate} />

  if (path.startsWith('/host')) return <HostApp path={path} navigate={navigate} />

  const join = path.match(/^\/join(?:\/(\d{0,6}))?/)
  if (join) return <PlayerApp key={join[1] || 'blank'} initialCode={join[1] || ''} navigate={navigate} />

  return <Landing navigate={navigate} />
}
