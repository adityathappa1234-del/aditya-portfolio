import { useEffect, useRef } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

/**
 * Ambient canvas field: faint grid, drifting particles with proximity links,
 * and a soft spotlight that follows the pointer.
 *
 * Performance notes:
 * - Particle count scales with viewport area and is capped, so phones do less work.
 * - The link pass is O(n^2); the cap keeps n small enough for that to be cheap.
 * - The loop halts when the tab is hidden and when reduced motion is requested
 *   (in which case a single static frame is painted instead).
 */
export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = theme === 'dark'
    // Tuned per theme: dark needs brighter strokes to register at all.
    const dot = isDark ? '167, 139, 250' : '99, 102, 241'
    const gridAlpha = isDark ? 0.045 : 0.04
    const dotAlphaScale = isDark ? 1.25 : 1
    const linkAlpha = isDark ? 0.075 : 0.05

    let animationId = 0
    let mouseX = -9999
    let mouseY = -9999
    let particles: Particle[] = []
    let dpr = 1

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2) // cap DPR: 3x costs a lot for a blur
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const area = window.innerWidth * window.innerHeight
      const count = Math.min(60, Math.max(18, Math.round(area / 26000)))

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.6 + 0.8,
        opacity: Math.random() * 0.3 + 0.12,
      }))
    }

    const drawFrame = (animate: boolean) => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      // Grid
      const gridSize = 48
      ctx.strokeStyle = `rgba(${dot}, ${gridAlpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x <= w; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()

      // Particles
      for (const p of particles) {
        if (animate) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > w) p.vx *= -1
          if (p.y < 0 || p.y > h) p.vy *= -1
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dot}, ${p.opacity * dotAlphaScale})`
        ctx.fill()
      }

      // Proximity links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${dot}, ${linkAlpha * (1 - dist / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Pointer spotlight
      if (mouseX > -9999) {
        const g = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 420)
        g.addColorStop(0, `rgba(129, 140, 248, ${isDark ? 0.09 : 0.06})`)
        g.addColorStop(0.4, `rgba(167, 139, 250, ${isDark ? 0.045 : 0.03})`)
        g.addColorStop(1, 'rgba(129, 140, 248, 0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
    }

    const loop = () => {
      drawFrame(true)
      animationId = requestAnimationFrame(loop)
    }

    const onResize = () => {
      setup()
      if (reduced) drawFrame(false)
    }
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const onVisibility = () => {
      if (reduced) return
      cancelAnimationFrame(animationId)
      if (!document.hidden) loop()
    }

    setup()
    if (reduced) {
      drawFrame(false) // one static frame, no rAF loop at all
    } else {
      loop()
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      document.addEventListener('visibilitychange', onVisibility)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [theme, reduced])

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      {/* Vignette: sinks the edges so receding sections read as going "into" the page. */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_srgb,var(--bg)_70%,transparent)_100%)]"
        aria-hidden="true"
      />
      <div className="noise-overlay" aria-hidden="true" />
    </>
  )
}
