import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
// Fontsource 5.3 maps "pkg/700" to "700.css" via its exports field; adding ".css" here breaks the build.
import '@fontsource/be-vietnam-pro/500'
import '@fontsource/be-vietnam-pro/600'
import '@fontsource/be-vietnam-pro/800'
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
