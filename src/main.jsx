import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { isNativeApp } from './config.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Offline support for the website: public/sw.js keeps a copy of the app so it
// opens without internet. Not used in the phone apps, which already bundle it.
if (
  import.meta.env.PROD &&
  'serviceWorker' in navigator &&
  window.location.protocol === 'https:' &&
  window.location.hostname !== 'localhost' &&
  !isNativeApp()
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // If it fails, the app still works online.
    })
  })
}
