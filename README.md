# Aditya Koushal - Portfolio

A premium, one-page portfolio built with React 19, TypeScript, and Vite. Designed with Vercel/Apple-level attention to detail.

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast development
- **Tailwind CSS v4** - Utility-first CSS with custom theme
- **Framer Motion** - Declarative animations
- **GSAP** - Advanced timeline animations
- **Lenis** - Smooth scrolling
- **React Helmet Async** - SEO management

## Features

- 🎯 Interactive floating bottom navigation (iPhone dock-style)
- 💫 Custom cursor with smooth spring animations
- 🃏 3D tilt cards with mouse tracking
- 📊 Animated experience timeline
- 🚀 Project cards with hover effects
- 🧠 Magnetic skill pills
- 📱 Fully responsive (mobile-first)
- 🌓 SEO optimized with JSON-LD structured data
- 🎨 Subtle canvas grid background with mouse glow
- 📜 Scroll progress indicator
- 📋 Copy email to clipboard
- ⌨️ Keyboard accessible (Home key scrolls to top)

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── animations/     # Framer Motion variants
├── components/
│   ├── layout/    # Navigation, SEO
│   ├── sections/  # Hero, About, Experience, Skills, Projects, Education, Contact
│   └── ui/        # Background, Cursor, AnimatedSection, ScrollProgress
├── data/          # Portfolio content (experience, skills, projects, etc.)
├── hooks/         # useScrollProgress, useScrollHide
└── utils/         # cn() utility
```

## Color Palette

- Background: `#F7F8FC`
- Cards: White
- Accent: `#6366F1` (Indigo)
- Secondary: `#8B5CF6` (Purple)
- Text: `#111827`
- Secondary Text: `#6B7280`

## Author

**Aditya Koushal** - Frontend Developer