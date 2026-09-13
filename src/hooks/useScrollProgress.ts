import { useEffect, useState } from 'react'

/**
 * Tracks overall scroll progress (0-100) and the section currently occupying
 * the viewport.
 *
 * Scroll handlers run on every frame, so the work is coalesced into a single
 * rAF tick — otherwise this would fire dozens of React renders per second and
 * fight the GSAP/Lenis loop for main-thread budget.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    let ticking = false

    const measure = () => {
      ticking = false

      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0)

      // Active = the section whose top is closest to (but not past) the line
      // 40% down the viewport. More stable than a plain "is it in range" test,
      // which flickers where two sections overlap.
      const line = window.innerHeight * 0.4
      let best = ''
      let bestDist = Infinity

      document.querySelectorAll<HTMLElement>('section[id]').forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= line && rect.bottom > line) {
          const dist = Math.abs(rect.top - line)
          if (dist < bestDist) {
            bestDist = dist
            best = section.id
          }
        }
      })

      if (best) setActiveSection(best)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(measure)
      }
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { progress, activeSection }
}
