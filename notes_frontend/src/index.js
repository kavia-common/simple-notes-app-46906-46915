import Blits from '@lightningjs/blits'
import App from './App.js'

document.addEventListener('DOMContentLoaded', () => {
  const mountId = 'app'
  const mountEl = document.getElementById(mountId)

  // Minimal visible fallback in DOM so we always see something if canvas doesn't render yet
  const fallback = document.createElement('div')
  fallback.setAttribute('data-fallback', 'true')
  fallback.style.cssText =
    'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f9fafb;color:#111827;'
  fallback.innerHTML =
    '<div style="padding:12px 16px;border-radius:10px;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.08);font-size:14px">Booting Ocean Notes…</div>'
  document.body.appendChild(fallback)

  try {
    const app = Blits.Launch(App, mountId, {
      w: 1280,
      h: 720,
      debugLevel: 1,
    })

    // Decorate page and canvas for visual confirmation
    document.body.style.background = '#f9fafb'
    document.body.style.margin = '0'

    const canvas = app.stage?.getCanvas?.()
    if (canvas) {
      canvas.style.borderRadius = '16px'
      canvas.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'
      canvas.style.display = 'block'
      canvas.style.margin = '16px auto'
      // Put a tiny overlay label on top-left of the canvas as a second fallback
      const overlay = document.createElement('div')
      overlay.id = 'boot-overlay'
      overlay.style.cssText =
        'position:fixed;top:20px;left:20px;padding:6px 10px;border-radius:8px;background:#111827;color:#fff;font:12px/1 system-ui;z-index:10;opacity:.9'
      overlay.textContent = 'Loading…'
      document.body.appendChild(overlay)

      // When app notifies it’s ready, remove DOM fallbacks
      window.addEventListener('ocean-notes:ready', () => {
        overlay.remove()
        fallback.remove()
      })
    } else {
      console.warn('[Ocean Notes] Canvas not available from app.stage.getCanvas().')
    }

    // Also remove the large fallback once the first frame paints (best-effort)
    requestAnimationFrame(() => {
      if (fallback.isConnected) {
        fallback.remove()
      }
    })
  } catch (e) {
    console.error('[Ocean Notes] Failed to launch app:', e)
    // Provide visible error to user
    if (mountEl) {
      fallback.innerHTML =
        '<div style="padding:12px 16px;border-radius:10px;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.08);font-size:14px;color:#b91c1c">Failed to start. Check console.</div>'
    }
  }
})
