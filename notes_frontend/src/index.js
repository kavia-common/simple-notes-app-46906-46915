import Blits from '@lightningjs/blits'
import App from './App.js'

document.addEventListener('DOMContentLoaded', async () => {
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
    // For Blits v1.29.x: prefer Launch; also support createApp signature
    if (typeof Blits.Launch === 'function') {
      app = Blits.Launch(App, mountId, { w: 1280, h: 720, debugLevel: 1 })
    } else if (typeof Blits.createApp === 'function') {
      app = Blits.createApp(App, { stage: { w: 1280, h: 720, canvasId: mountId } })
    } else if (typeof Blits.Application === 'function') {
      app = new (Blits.Application(App))()
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
    overlay.remove()
    if (fallback.isConnected) fallback.remove()
    const sb = document.getElementById('startup-banner')
    if (sb) sb.remove()
  }

  // If app didn't throw but still not rendering, attempt delayed cleanup so baseline DOM remains
  window.addEventListener('ocean-notes:ready', cleanup, { once: true })
  // Defensive: still cleanup after first frame to avoid overlay lingering
  requestAnimationFrame(() => cleanup())

  // Edge: if canvas is available, style it for nicer appearance
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
