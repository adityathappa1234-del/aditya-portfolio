import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Single place where GSAP plugins are registered.
 * Importing from here (instead of 'gsap' directly) guarantees ScrollTrigger is
 * registered exactly once, even under React StrictMode's double-mount in dev.
 */
gsap.registerPlugin(ScrollTrigger)

/**
 * Shared tuning for the site-wide scroll choreography.
 * These are the knobs to turn when the effect feels too strong or too subtle.
 */
export const DEPTH = {
  /** Scale a section starts at while it is still "far away". 1 = no scaling. */
  scaleFrom: 0.85,
  /** Scale a section recedes to as it leaves. Lower = pushes further back. */
  scaleTo: 0.85,
  /** Vertical travel (px) on the way in -- positive = rises toward you. */
  yFrom: 64,
  /** Vertical travel (px) on the way out. */
  yTo: -48,
  /** Z travel (px) -- the actual depth, needs .depth-scene perspective above. */
  zFrom: -180,
  zTo: -180,
  /** Scrub smoothing in seconds. 0.5 = slight lag, true = locked to scroll. */
  scrub: 0.5,
  /** Opacity a section fades to once it has receded. */
  opacityOut: 0,
} as const

/** Standard easing curve used across Framer Motion and GSAP alike. */
export const EASE = [0.25, 0.1, 0.25, 1] as const

/**
 * Recomputes every ScrollTrigger's cached start/end position.
 * Call after anything that changes document height — an accordion opening, a
 * filter swapping content, fonts or images finishing load — otherwise triggers
 * keep firing at the positions that were measured before the reflow.
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}

export { gsap, ScrollTrigger }
