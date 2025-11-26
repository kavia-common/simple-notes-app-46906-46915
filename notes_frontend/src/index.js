import Blits from '@lightningjs/blits'
import App from './App.js'

document.addEventListener('DOMContentLoaded', () => {
  const mountId = 'app'
  const mountEl = document.getElementById(mountId)

  // Ensure mount element exists
  if (!mountEl) {
    const err = new Error(`#${mountId} not found in index.html`)
    console.error('[Ocean Notes] Mount element missing:', err)
    const warn = document.createElement('div')
    warn.style.cssText =
      'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#fff;color:#b91c1c'
    warn.textContent = 'Failed to start: app mount not found'
    document.body.appendChild(warn)
    return
  }

  // Minimal visible fallback
  const fallback = document.createElement('div')
  fallback.setAttribute('data-fallback', 'true')
  fallback.style.cssText =
    'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f9fafb;color:#111827;'
  fallback.innerHTML =
    '<div style="padding:12px 16px;border-radius:10px;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.08);font-size:14px">Booting Ocean Notes…</div>'
  document.body.appendChild(fallback)

  let app
  try {
    // For @lightningjs/blits 1.29.x the public start helper is Launch(App, mountId, opts)
    if (typeof Blits.Launch === 'function') {
      app = Blits.Launch(App, mountId, { w: 1280, h: 720, debugLevel: 1 })
    } else if (typeof Blits.createApp === 'function') {
      // Older API fallback
      app = Blits.createApp(App, { stage: { w: 1280, h: 720, canvasId: mountId } })
    } else if (typeof Blits.Application === 'function') {
      // Very old pattern
      const AppCtor = Blits.Application(App)
      app = new AppCtor()
      app.start({ stage: { w: 1280, h: 720, canvasId: mountId } })
    } else {
      throw new Error('No compatible Blits launch API found')
    }
  } catch (e) {
    console.error('[Ocean Notes] Failed to launch app:', e)
  }

  // Always show something even if app failed
  document.body.style.background = '#f9fafb'
  document.body.style.margin = '0'

  const overlay = document.createElement('div')
  overlay.id = 'boot-overlay'
  overlay.style.cssText =
    'position:fixed;top:20px;left:20px;padding:6px 10px;border-radius:8px;background:#111827;color:#fff;font:12px/1 system-ui;z-index:10;opacity:.9'
  overlay.textContent = 'Loading…'
  document.body.appendChild(overlay)

  const cleanup = () => {
    try { overlay.remove() } catch (e) { console.warn('[Ocean Notes] Overlay cleanup failed:', e) }
    try {
      if (fallback.isConnected) fallback.remove()
    } catch (e) { console.warn('[Ocean Notes] Fallback cleanup failed:', e) }
    try {
      const sb = document.getElementById('startup-banner')
      if (sb) sb.remove()
    } catch (e) { console.warn('[Ocean Notes] Startup banner cleanup failed:', e) }
  }

  // Clean on app ready or next frame to ensure overlay doesn't linger
  window.addEventListener('ocean-notes:ready', cleanup, { once: true })
  requestAnimationFrame(() => cleanup())

  // Style canvas if present
  try {
    const canvas =
      app?.stage?.getCanvas?.() ||
      document.querySelector(`#${mountId} canvas`) ||
      document.querySelector('canvas')

    if (canvas) {
      canvas.style.borderRadius = '16px'
      canvas.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'
      canvas.style.display = 'block'
      canvas.style.margin = '16px auto'
    } else {
      console.warn('[Ocean Notes] Canvas element not found after launch.')
    }
  } catch (err) {
    console.warn('[Ocean Notes] Canvas styling failed:', err)
  }
})
