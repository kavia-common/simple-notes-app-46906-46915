import Blits from '@lightningjs/blits'
import App from './App.js'

document.addEventListener('DOMContentLoaded', () => {
  const app = Blits.Launch(App, 'app', {
    w: 1280,
    h: 720,
    debugLevel: 1,
  })
  document.body.style.background = '#f9fafb'
  document.body.style.margin = '0'
  const canvas = app.stage.getCanvas()
  canvas.style.borderRadius = '16px'
  canvas.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'
  canvas.style.display = 'block'
  canvas.style.margin = '16px auto'
})
