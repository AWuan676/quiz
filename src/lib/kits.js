import { Triangle, Diamond, Circle, Square } from 'lucide-react'

/** Team kits, assigned in join order. fg is the number/label colour that clears contrast on bg. */
export const KITS = [
  { id: 'red', bg: '#E5243B', fg: '#FFFFFF' },
  { id: 'blue', bg: '#1D5BFF', fg: '#FFFFFF' },
  { id: 'yellow', bg: '#FFC20E', fg: '#12141C' },
  { id: 'green', bg: '#0FA24A', fg: '#FFFFFF' },
  { id: 'orange', bg: '#FF6A13', fg: '#12141C' },
  { id: 'purple', bg: '#7B3FE4', fg: '#FFFFFF' },
  { id: 'cyan', bg: '#00B3D6', fg: '#12141C' },
  { id: 'pink', bg: '#FF3D8B', fg: '#12141C' },
]

export const kitFor = (index) => KITS[index % KITS.length]

export const MAX_TEAMS = 16

/** Standard Quiz answer plates: colour + shape, so colour is never the only cue. */
export const ANSWER_PLATES = [
  { letter: 'A', bg: '#E5243B', fg: '#FFFFFF', Icon: Triangle },
  { letter: 'B', bg: '#1D5BFF', fg: '#FFFFFF', Icon: Diamond },
  { letter: 'C', bg: '#FFC20E', fg: '#12141C', Icon: Circle },
  { letter: 'D', bg: '#0FA24A', fg: '#FFFFFF', Icon: Square },
]
