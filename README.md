# Portfolio

A minimal, editorial single-page portfolio. Swiss-influenced typography, a monochrome
palette, and motion that's deliberate rather than decorative. Built with Next.js 14
(App Router), TypeScript, and Tailwind CSS.

## Stack

- **Next.js 14** — App Router, fully statically rendered
- **TypeScript** — strict mode
- **Tailwind CSS** — design tokens in `tailwind.config.ts`
- **Helvetica** — system stack (`Helvetica Neue → Helvetica → Arial`), zero bytes to load
- **Instrument Serif** — the single web font, one weight, used italic for accented words
- **No animation library** — every transition is CSS or a hand-rolled `requestAnimationFrame`
  loop. The whole page is ~93 kB of JS on first load.

## Develop

```bash
npm install
```

```bash
npm run dev
```

Then `npm run build` for a production build and `npm run start` to serve it.

> Don't run `npm run build` while `npm run dev` is running — they share `.next` and the
> build will pull it out from under the dev server. Stop dev first, or `rm -rf .next`
> afterwards.

## Make it yours

Almost everything you'll want to change lives in one file:
[`content/site.ts`](content/site.ts).

- `site` — name, role, tagline, email, timezone (the canonical URL resolves itself,
  see [Canonical URL](#canonical-url))
- `motion` — switches for the intro and the marquee
- `about` — bio paragraphs and the stack list
- `projects` — the Work rows
- `testimonials` — empty the array and the section removes itself
- `socials`, `marqueeItems`

### Accent type

Any copy that runs through `TextReveal` (taglines, section titles, about paragraphs)
supports `*asterisks*` to set a run in the display serif italic:

```ts
title: "Selected *works*."
```

Use it once per heading at most — it stops being an accent if it's everywhere.

### Project images

Each project's `image` is optional. Drop a screenshot in `/public/work/` and point at it;
omit it and the row renders a typographic plate instead of a broken image. A project with
an empty `href` renders unlinked — for work that isn't public yet — and pairs with
`status: "in-development"`.

## Motion

| Piece | Where | Notes |
| --- | --- | --- |
| Intro counter | `Preloader.tsx` | Once per session, click or key to skip |
| Word-mask reveals | `TextReveal.tsx` | Per-word masks, staggered |
| Magnetic hover | `Magnetic.tsx` | Email, back-to-top |
| Scroll-reactive ticker | `Marquee.tsx` | Speeds up and reverses with scroll direction |
| Cursor-following preview | `WorkIndex.tsx` | Banks into the turns via pointer lag; carries the "View" disc |
| Footer reveal | `FooterReveal.tsx` | Fixed footer uncovered by the scrolling page |

`prefers-reduced-motion` disables all of it in one place, at the bottom of
[`app/globals.css`](app/globals.css). The type reveals hide their words only under a `.js`
class set by an inline script, so a visitor without JavaScript gets plain readable text
rather than a blank page.

## Structure

```
app/
  layout.tsx          # font, metadata, intro + cursor providers, skip link
  page.tsx            # composes the sections
  globals.css         # base styles, reveal/cursor/marquee utilities, reduced-motion
  icon.tsx            # generated favicon
  opengraph-image.tsx # generated link preview, built from content/site.ts
  robots.ts / sitemap.ts
components/           # sections + motion primitives
lib/
  motion.ts           # easing, media queries, frame-rate independent damping
  lenis.ts            # shared scroll instance + lock/unlock
  useScrollVelocity.ts
content/site.ts       # all editable content
```

## Deploy to Vercel

Stock Next.js app — Vercel auto-detects everything.

**Git (recommended):** push to GitHub/GitLab, import at [vercel.com/new](https://vercel.com/new).

**CLI:**

```bash
npx vercel --prod
```

### Canonical URL

`site.url` feeds Open Graph, `sitemap.xml` and `robots.txt`. It resolves itself at build
time rather than being hardcoded, most specific first:

1. `NEXT_PUBLIC_SITE_URL` — set this in the Vercel dashboard once a real domain points
   here. A bare hostname is fine; the protocol and trailing slash are normalised.
2. `VERCEL_PROJECT_PRODUCTION_URL` — set automatically by Vercel. Always the production
   host, so preview deploys don't advertise themselves as canonical.
3. `http://localhost:3000` for local dev and builds.

So a fresh Vercel deploy has correct metadata with no configuration, and pointing a
custom domain at it later is one dashboard variable — no code change.
