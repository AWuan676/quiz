import { Triangle, Diamond, Circle, Square } from 'lucide-react'

/** Team colours: flat map areas, assigned in join order. All carry ink text. */
export const KITS = [
  { id: 'land', bg: '#8ED462', fg: '#2C2E2A' },
  { id: 'coral', bg: '#FF705D', fg: '#2C2E2A' },
  { id: 'pond', bg: '#2BA0FF', fg: '#2C2E2A' },
  { id: 'sun', bg: '#F5E211', fg: '#2C2E2A' },
  { id: 'lilac', bg: '#EBC1FF', fg: '#2C2E2A' },
  { id: 'apricot', bg: '#FFB46B', fg: '#2C2E2A' },
  { id: 'mint', bg: '#7ED9CB', fg: '#2C2E2A' },
  { id: 'rose', bg: '#FFA3C7', fg: '#2C2E2A' },
]

export const kitFor = (index) => KITS[index % KITS.length]

export const MAX_TEAMS = 16

/** Standard Quiz answer pins: colour + shape, so colour is never the only cue. */
export const ANSWER_PLATES = [
  { letter: 'A', bg: '#FF705D', fg: '#2C2E2A', Icon: Triangle },
  { letter: 'B', bg: '#2BA0FF', fg: '#2C2E2A', Icon: Diamond },
  { letter: 'C', bg: '#F5E211', fg: '#2C2E2A', Icon: Circle },
  { letter: 'D', bg: '#8ED462', fg: '#2C2E2A', Icon: Square },
]
