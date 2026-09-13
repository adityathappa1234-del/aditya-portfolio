import { useCallback, useEffect, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { AnimatePresence } from 'framer-motion'

import { ThemeProvider } from '@/context/ThemeProvider'
import { ScrollTrigger } from '@/animations/gsap'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import { SEO } from '@/components/layout/SEO'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Background } from '@/components/ui/Background'
import { Cursor } from '@/components/ui/Cursor'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Loader } from '@/components/ui/Loader'

import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Education } from '@/components/sections/Education'
import { Contact } from '@/components/sections/Contact'

const LOADER_SESSION_KEY = 'portfolio-intro-seen'

function AppShell() {
  const reduced = usePrefersReducedMotion()

  // Intro plays once per tab session, and never when motion is reduced.
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem(LOADER_SESSION_KEY) !== 'true'
    } catch {
      return true
    }
  })

  // Lenis is skipped under reduced motion so native scrolling stays untouched.
  useSmoothScroll(!reduced && !showLoader)

  const dismissLoader = useCallback(() => {
    setShowLoader(false)
    try {
      sessionStorage.setItem(LOADER_SESSION_KEY, 'true')
    } catch {
      // Storage unavailable: the intro simply plays again next visit.
    }
  }, [])

  // Lock scrolling behind the intro curtain.
  useEffect(() => {
    document.body.style.overflow = showLoader ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showLoader])

  // Images and web fonts land after first paint and change element positions,
  // so every ScrollTrigger start/end measured before that is stale.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()

    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh).catch(() => {})
    const settle = window.setTimeout(refresh, 600)

    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(settle)
    }
  }, [showLoader])

  // `Home` key jumps to the top.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <SEO />

      <AnimatePresence>
        {showLoader && <Loader key="loader" onDone={dismissLoader} />}
      </AnimatePresence>

      <Cursor />
      <Background />
      <ScrollProgress />
      <ThemeToggle />

      {/* .depth-scene supplies the perspective that turns DepthSection's
          scale/z tweens into actual depth rather than a flat zoom. */}
      <main className="depth-scene relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Navigation />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </HelmetProvider>
  )
}
