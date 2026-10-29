import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  browserSessionPersistence,
  getAuth,
  initializeAuth,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { firebaseConfig } from '../firebaseConfig.js'

export const isConfigured = Boolean(firebaseConfig.apiKey) && !firebaseConfig.apiKey.startsWith('PASTE')

/*
 * Two Firebase app instances on purpose:
 *  - "host": Google sign-in, remembered across visits; owns quizzes and rooms.
 *  - "player": anonymous sign-in kept per browser TAB (session persistence), so
 *    several player tabs on one computer are different people, and a phone that
 *    reloads keeps its identity.
 */
const hostApp = isConfigured ? initializeApp(firebaseConfig) : null
const playerApp = isConfigured ? initializeApp(firebaseConfig, 'player') : null

export const hostAuth = hostApp ? getAuth(hostApp) : null
export const playerAuth = playerApp ? initializeAuth(playerApp, { persistence: browserSessionPersistence }) : null

export const firestore = hostApp ? getFirestore(hostApp) : null
export const hostDb = hostApp ? getDatabase(hostApp) : null
export const playerDb = playerApp ? getDatabase(playerApp) : null

export async function signInHostWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  try {
    await signInWithPopup(hostAuth, provider)
  } catch (err) {
    // Phones and some in-app browsers (Zalo) block popups: fall back to a redirect.
    if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/operation-not-supported-in-this-environment') {
      await signInWithRedirect(hostAuth, provider)
    } else {
      throw err
    }
  }
}

export const signOutHost = () => signOut(hostAuth)

export async function ensurePlayerUser() {
  if (playerAuth.currentUser) return playerAuth.currentUser
  await playerAuth.authStateReady()
  if (playerAuth.currentUser) return playerAuth.currentUser
  const cred = await signInAnonymously(playerAuth)
  return cred.user
}
