# Prompt for Claude Code (paste this into VS Code)

Copy everything below the line into your Claude Code chat inside VS Code, inside your existing React portfolio project folder.

---

I have an existing React portfolio project in this workspace. It already contains my rough content and structure (projects, about me, skills, contact info) but the styling and UX are basic. I want you to **read every file in this project first** (components, pages, CSS, data/content files, package.json) so you understand exactly what content and structure already exists, then **redesign and restyle it into a professional, modern, animation-rich portfolio** without losing or inventing false information about me.

## Step 1 — Audit
- Read all files in `src/` (components, pages, assets, data).
- List out: what sections currently exist, what content is already written, what's missing (e.g. no dark mode, no animations, inconsistent spacing).
- Tell me the current tech stack (React version, plain CSS / Tailwind / styled-components, router, etc.) before making changes.

## Step 2 — Design system
Apply a cohesive, professional color palette and typography system. Use one of these directions (pick the one that best fits my content, or propose a better one and explain why):

1. **Modern dark tech** — near-black background (#0A0A0F), electric indigo/violet accent (#6366F1 / #8B5CF6), soft white text (#E5E7EB), muted gray secondary text (#9CA3AF).
2. **Warm minimal** — off-white background (#FAFAF8), deep charcoal text (#1A1A1A), single warm accent like burnt orange or terracotta (#E76F51), used sparingly.
3. **Cool professional** — deep navy background (#0F172A), teal/cyan accent (#22D3EE), slate grays for secondary surfaces.

Requirements:
- Consistent spacing scale (e.g. 4/8/16/24/32/64px), consistent border-radius, consistent font pairing (one display font for headings, one clean sans for body — e.g. via Google Fonts).
- Support both light and dark mode if feasible, or commit fully to one polished theme.
- Make it responsive (mobile, tablet, desktop) — no cut-off text or broken layouts.

## Step 3 — Animation libraries
Install and use:
- **GSAP + ScrollTrigger** (`gsap`, `gsap/ScrollTrigger`) — this is the primary engine for scroll-driven animation.
- **Framer Motion** — for component-level entrance animations, hover states, page transitions, and micro-interactions (buttons, cards, nav).
- Optional: **Lenis** (`@studio-freight/lenis`) for buttery smooth scroll, which pairs very well with GSAP ScrollTrigger.

## Step 4 — The signature scroll effect (most important)
I want a **depth / "coming toward you" scroll effect**:
- As each section scrolls INTO view (scrolling down), it should scale up slightly (e.g. from `scale(0.85)` to `scale(1)`), fade in (`opacity 0 → 1`), and optionally shift up a little on the Y axis — giving the impression the content is moving toward the viewer.
- As a section scrolls OUT of view (scrolling further down, or scrolling back up past it), it should scale down and fade (e.g. `scale(1) → 0.85`, `opacity 1 → 0`), giving the impression it's receding away from the viewer, like it's being pushed back into the screen.
- This should be **scroll-linked (scrubbed)**, not just a one-time trigger — meaning the animation progress should follow the scroll position directly, playing forward when scrolling down and reversing smoothly when scrolling up, not just fading in once and staying static.
- Implement this using GSAP ScrollTrigger with `scrub: true` (or `scrub: 0.5` for slight smoothing) on each major section, animating `scale`, `opacity`, and optionally `y` / `z` with `transform-style: preserve-3d` and a `perspective` on the parent container for a real sense of depth.
- Apply this consistently to: Hero, About, Skills, Projects (each project card can stagger in individually), and Contact sections.
- Respect `prefers-reduced-motion` — disable or drastically simplify the animation for users who have that OS setting enabled.

## Step 5 — Supporting animations
- Hero section: staggered text reveal on load (name, title, tagline), subtle floating/parallax background element.
- Navbar: smooth show/hide or shrink-on-scroll behavior, animated underline on hover for links, smooth scroll-to-section on click.
- Project cards: hover lift + shadow/scale, image zoom on hover, staggered entrance when the section comes into view.
- Skills section: animated progress bars or icon reveal with stagger.
- Buttons/links: consistent hover/tap micro-interactions via Framer Motion (`whileHover`, `whileTap`).
- Page load: a brief, tasteful loading/intro animation is optional — keep it under 1-1.5s, skippable.

## Step 6 — Performance & code quality
- Keep animations GPU-friendly: animate `transform` and `opacity` only, avoid animating `width`/`height`/`top`/`left`.
- Clean up and kill ScrollTrigger instances on component unmount to avoid memory leaks (important in React).
- Lazy-load images/project screenshots.
- Keep components modular — don't cram everything into one file.
- Add comments explaining the animation logic so I can tweak values later.

## Step 7 — Deliverable
After implementing:
- Give me a short summary of every file you changed/created and why.
- Tell me which npm packages you installed and the exact install command.
- Point out 2-3 values (e.g. scale range, scrub speed, color hex codes) I can easily tweak if I want to adjust the "intensity" of the effect or the palette.

Do not remove or fabricate any real content (project names, descriptions, links, bio) — only restyle, restructure, and animate what already exists. If something is genuinely missing (like a proper meta description or favicon), flag it separately instead of inventing content.
