import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, DEPTH } from '@/animations/gsap'
import { cn } from '@/utils/cn'

interface DepthSectionProps {
  children: ReactNode
  className?: string
  /**
   * `both`  - scales up on the way in, recedes on the way out (default)
   * `enter` - only the incoming half (use for content that must stay readable)
   * `exit`  - only the receding half (use for the Hero, which starts on screen)
   */
  mode?: 'both' | 'enter' | 'exit'
  /** Multiplies the effect strength. 0.5 = half as dramatic, 1.5 = stronger. */
  intensity?: number
  /** Extra lead-in delay expressed as a viewport-percentage offset. */
  offset?: number
}

/**
 * THE SIGNATURE SCROLL EFFECT — "coming toward you" depth.
 * ---------------------------------------------------------------------------
 * The section scales up + fades in + rises as it enters the viewport, then
 * scales down + fades + sinks as it leaves, so content feels like it travels
 * toward the viewer and is pushed back into the screen afterwards.
 *
 * Both halves are `scrub`bed, so progress is bound directly to scroll position:
 * scrolling up reverses the animation frame-for-frame instead of replaying it.
 *
 * WHY TWO NESTED DIVS: the enter and exit tweens both animate scale/opacity/y.
 * Driving both from one element makes the two ScrollTriggers fight over the
 * same properties the moment their ranges overlap (which they do on short
 * sections). Giving each its own element lets the browser compose the two
 * transforms — the result is the product of both, and neither tween can
 * clobber the other. It is also section-height independent, so a 3000px
 * Projects section behaves exactly like a 600px Contact section.
 *
 * TWEAK: `DEPTH` in src/animations/gsap.ts holds the scale range, z distance
 * and scrub smoothing. `intensity` here scales those per-section.
 */
export function DepthSection({
  children,
  className,
  mode = 'both',
  intensity = 1,
  offset = 0,
}: DepthSectionProps) {
  const enterRef = useRef<HTMLDivElement>(null)
  const exitRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const enterEl = enterRef.current
    const exitEl = exitRef.current
    if (!enterEl || !exitEl) return

    // gsap.context scopes every tween/trigger created inside it, so a single
    // ctx.revert() on unmount kills them all — no leaked ScrollTriggers when
    // React remounts (StrictMode) or the theme/route changes.
    const ctx = gsap.context(() => {
      // matchMedia gives us an automatic teardown when the OS motion setting
      // changes: the "no-preference" branch is reverted and the reduce branch
      // takes over without a reload.
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scale = 1 - (1 - DEPTH.scaleFrom) * intensity
        const z = DEPTH.zFrom * intensity
        const yIn = DEPTH.yFrom * intensity
        const yOut = DEPTH.yTo * intensity

        // --- Incoming half: recedes -> arrives -------------------------------
        if (mode === 'both' || mode === 'enter') {
          gsap.fromTo(
            enterEl,
            { scale, opacity: 0, y: yIn, z },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              z: 0,
              ease: 'none', // scrubbed tweens should track scroll linearly
              scrollTrigger: {
                trigger: enterEl,
                // Runs from "top edge enters the bottom 10% of the viewport"
                // to "top edge reaches 45% up the viewport".
                start: `top ${90 + offset}%`,
                end: 'top 45%',
                scrub: DEPTH.scrub,
                invalidateOnRefresh: true,
              },
            }
          )
        }

        // --- Outgoing half: arrived -> pushed back ---------------------------
        if (mode === 'both' || mode === 'exit') {
          gsap.fromTo(
            exitEl,
            { scale: 1, opacity: 1, y: 0, z: 0 },
            {
              scale: 1 - (1 - DEPTH.scaleTo) * intensity,
              opacity: DEPTH.opacityOut,
              y: yOut,
              z: DEPTH.zTo * intensity,
              ease: 'none',
              scrollTrigger: {
                trigger: exitEl,
                // Begins once the section's bottom edge passes the 60% line and
                // completes just as it clears the top of the viewport.
                start: 'bottom 60%',
                end: 'bottom 2%',
                scrub: DEPTH.scrub,
                invalidateOnRefresh: true,
              },
            }
          )
        }
      })

      // Reduced motion: no scroll-linked transforms at all, content is simply
      // present. Cleared explicitly so nothing is left mid-tween.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([enterEl, exitEl], { clearProps: 'all' })
      })

      return () => mm.revert()
    })

    return () => ctx.revert()
  }, [mode, intensity, offset])

  return (
    <div ref={enterRef} className={cn('depth-layer', className)}>
      <div ref={exitRef} className="depth-layer">
        {children}
      </div>
    </div>
  )
}
