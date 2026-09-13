import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/animations/gsap'

/** Module-level handle so any component can scroll via Lenis (see scrollToSection). */
let lenisInstance: Lenis | null = null

/**
 * Boots Lenis smooth scrolling and hands scroll control to GSAP's ticker so
 * ScrollTrigger reads the *smoothed* position rather than the raw one. Without
 * this handshake, scrubbed animations visibly lag a frame behind the page.
 *
 * Skipped entirely when the user prefers reduced motion -- native scrolling is
 * left alone and ScrollTrigger falls back to normal scroll events.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      lenisInstance = null
      return
    }

    const lenis = new Lenis({
      duration: 1.1,                                             // TWEAK: higher = floatier scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })
    lenisInstance = lenis

    // Keep ScrollTrigger in sync with Lenis' interpolated scroll position.
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    // Lenis has its own delta handling; GSAP's lag smoothing would double-correct.
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

/** Smoothly scrolls to a section id, using Lenis when it is running. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: 0, duration: 1.2 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/** Scrolls back to the very top. */
export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.2 })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
