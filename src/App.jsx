import Landing from './Landing.jsx'
import HostApp from './host/HostApp.jsx'
import PlayerApp from './player/PlayerApp.jsx'
import { useRoute } from './lib/router.js'

/**
 * Three surfaces, switched by URL:
 *   /              Landing
 *   /host          Host (projector)
 *   /join          Player, empty code
 *   /join/123456   Player, code pre-filled (the QR link)
 */
export default function App() {
  const { path, navigate } = useRoute()

  if (path.startsWith('/host')) return <HostApp navigate={navigate} />

  const join = path.match(/^\/join(?:\/(\d{0,6}))?/)
  if (join) return <PlayerApp key={join[1] || 'blank'} initialCode={join[1] || ''} navigate={navigate} />

  return <Landing navigate={navigate} />
}
