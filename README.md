# Portfolio

A minimal, editorial single-page portfolio. Swiss-influenced typography, monochromatic
palette, and restrained motion. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Stack

- **Next.js 14** — App Router, statically rendered
- **TypeScript** — strict mode
- **Tailwind CSS** — design tokens in `tailwind.config.ts`
- **Helvetica** — system font stack (`Helvetica Neue → Helvetica → Arial`); no web fonts to load
- No animation libraries — scroll reveals use `IntersectionObserver`, hero parallax + the work-preview cursor follow use `requestAnimationFrame`

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

## Make it yours

Almost everything you'll want to change lives in one file: [`content/site.ts`](content/site.ts).

- `site` — name, role, tagline, email, canonical URL (used for metadata / Open Graph)
- `about` — bio paragraphs and the stack list
- `projects` — the Work rows (title, description, role, link, preview image)
- `socials` — GitHub / LinkedIn URLs

Each project's `href` is set to `#` — add the real URLs. Preview images live in
`/public/work/*.svg` as placeholders; drop in real screenshots (any image format) and point
`image` at them. Your name and email are already wired in; social URLs are still samples.

## Structure

```
app/
  layout.tsx        # fonts, metadata, <html> shell
  page.tsx          # composes the sections
  globals.css       # base styles + reveal/reduced-motion utilities
components/
  Header.tsx        # sticky minimal nav
  Hero.tsx          # name, tagline, parallax mark, scroll cue
  Work.tsx / ProjectCard.tsx
  About.tsx
  Contact.tsx / SocialIcons.tsx
  Footer.tsx
  Reveal.tsx        # fade-up-on-scroll wrapper
  Parallax.tsx      # scroll-driven parallax wrapper
  Section.tsx       # shared section shell
content/site.ts     # all editable content
```

Motion respects `prefers-reduced-motion` throughout.

## Deploy to Vercel

This is a stock Next.js app — Vercel auto-detects everything (no config needed).

**Option A — Git (recommended):** push this directory to a GitHub/GitLab repo, then import it
at [vercel.com/new](https://vercel.com/new). Every push to the default branch redeploys.

**Option B — CLI:**

```bash
npm i -g vercel
vercel        # first run links the project and deploys a preview
vercel --prod # promote to production
```

Set `site.url` in `content/site.ts` to your production domain so Open Graph metadata resolves
correctly.
