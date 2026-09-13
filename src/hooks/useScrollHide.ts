import { useEffect, useRef, useState } from 'react'

/**
 * Returns false while the user is scrolling *down* past the threshold, so
 * chrome (nav, rails) can get out of the way and return on the way back up.
 *
 * A small delta guard stops the flag from chattering when Lenis' interpolated
 * position wobbles by a pixel at the end of a scroll.
 */
export function useScrollHide(threshold = 120, delta = 6) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const measure = () => {
      ticking.current = false
      const y = window.scrollY
      const diff = y - lastScrollY.current

      if (Math.abs(diff) > delta) {
        setIsVisible(!(diff > 0 && y > threshold))
        lastScrollY.current = y
      }
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(measure)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold, delta])

  return isVisible
}
