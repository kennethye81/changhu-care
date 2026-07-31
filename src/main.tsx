import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { initDemoSync } from './sync/demoSync.ts'
import { DEMO_SYNC_STORAGE_KEY } from './sync/types.ts'

document.documentElement.classList.remove('dark')
localStorage.removeItem('ihomecare-theme')

if (typeof window !== 'undefined') {
  const url = new URL(window.location.href);
  if (url.searchParams.has('resetDemoSync')) {
    localStorage.removeItem(DEMO_SYNC_STORAGE_KEY);
    url.searchParams.delete('resetDemoSync');
    window.history.replaceState({}, '', url);
  }
}

initDemoSync()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
