import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/utils/cn'

interface MagneticProps {
  children: ReactNode
  className?: string
  /** How far the element leans toward the pointer, as a fraction of offset. */
  strength?: number
  href?: string
  onClick?: () => void
  download?: boolean
  target?: string
  rel?: string
  'aria-label'?: string
}

/**
 * Pointer-magnetic wrapper: the element leans toward the cursor while hovered
 * and springs home on leave. Uses motion values (not state) so the movement
 * never triggers a React render — it stays on the compositor.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.25,
  href,
  onClick,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 })

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const motionProps = {
    style: { x: springX, y: springY },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.96 },
    className: cn('inline-flex', className),
    ...rest,
  }

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        {...motionProps}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </motion.button>
  )
}
