import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import '@fontsource/big-shoulders-display/700.css'
import '@fontsource/big-shoulders-display/800.css'
import '@fontsource/big-shoulders-display/900.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow/700.css'
import './index.css'
import App from './App.jsx'
import { LangProvider } from './lib/i18n.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LangProvider>
  </StrictMode>,
)
