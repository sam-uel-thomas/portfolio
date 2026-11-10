/**
 * The canonical origin, behind Open Graph, the sitemap and robots.txt.
 *
 * Resolved at build time, most specific wins:
 *
 *  1. `NEXT_PUBLIC_SITE_URL` — set this in the Vercel dashboard once a real
 *     domain points here, and it overrides everything below.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — the project's stable production host,
 *     e.g. `portfolio-abc.vercel.app`. Vercel sets it automatically, and it
 *     stays the *production* host even when a preview build reads it, so
 *     preview deploys don't advertise themselves as canonical.
 *  3. localhost, for `next dev` and local builds.
 *
 * Only ever read on the server — metadata, sitemap, robots — which is why the
 * Vercel variable doesn't need a `NEXT_PUBLIC_` prefix to be useful here.
 */
function resolveSiteUrl(): string {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

  // A bare hostname is the easy thing to paste in, so accept one.
  const absolute = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  // Trailing slashes would double up in `${site.url}/sitemap.xml`.
  return absolute.replace(/\/+$/, "");
}

export const site = {
  name: "Sam Thomas",
  role: "Designer & Developer",
  /** Absolute origin, no trailing slash. See resolveSiteUrl above. */
  url: resolveSiteUrl(),
  // One-line hero description. Wrap words in *asterisks* to set them in the
  // display serif italic — the accent voice. Use it sparingly, 1–2 per page.
  tagline:
    "I'm a London-based designer and *full-stack* developer.",
  description:
    "I'm a freelance designer and developer, focused on building clean, well-designed systems from end to end.",
  // Forwarded to the personal inbox via Cloudflare Email Routing.
  email: "hello@madebysamthomas.com",
  location: "London, UK",
  timezone: "Europe/London",
  available: true,
  availabilityLabel: "Available for work",
};

/**
 * Motion switches. Every one of these degrades gracefully — turning any of
 * them off leaves a site that still works, it just moves less.
 * `prefers-reduced-motion` overrides all of them regardless.
 */
export const motion = {
  /** Full-screen intro counter on first visit of a session. */
  intro: true,
  /** Scroll-velocity-reactive ticker between sections. */
  marquee: true,
};

/** Ticker strip content. Kept short — it reads at a glance while moving. */
export const marqueeItems = [
  "Full-stack developer",
  "Available for work",
  "London, UK",
];

export type Testimonial = {
  quote: string;
  name: string;
  /** Role + organisation, e.g. "Founder, Loop Goods". */
  role: string;
};

// Empty on purpose. The Testimonials section renders nothing while this array
// is empty, so the live site has no testimonials rather than placeholder ones.
//
// The section markup and its lorem ipsum stand-ins are preserved on the
// `testimonials` branch. When real quotes arrive, add them here (with
// permission) and the section returns on its own — no component changes needed.
export const testimonials: Testimonial[] = [];

export const about = {
  // Two or three sentences. Keep it editorial — confident, no filler.
  paragraphs: [
    "I'm a full-stack developer with an eye for design. I build anything from web apps to e-commerce, backend included.",
    "Most recently I led development on *PRNTRS*, a white-label SaaS that lets print studios quickly create an online presence with a working backend system.",
    "I love working with smaller independent makers, artists and businesses who want a well-designed product without the agency overhead.",
  ],
  // Stack listed cleanly.
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Node.js",
    "Figma",
  ],
};

export type Project = {
  title: string;
  description: string;
  role: string;
  /** External URL. Leave empty for unreleased work — the row renders unlinked. */
  href: string;
  /** Preview image. Omit and the row falls back to a typographic plate. */
  image?: string;
  /** Short capability/stack chips. Optional — omit and nothing renders. */
  tags?: string[];
  /** Marks the row as unreleased rather than dead. */
  status?: "live" | "in-development";
};

export const projects: Project[] = [
  {
    title: "PRNTRS",
    description:
      "A print studio operating system, built white-label out of PrintDays. Independent print businesses get their own branded storefront, with a fully functional backend system. Able to be set up in less than 10 minutes.",
    role: "Lead Developer",
    href: "",
    status: "in-development",
    // TODO(sam): add a screenshot at /public/work/prntrs.webp when there's a
    // shippable screen — until then this row renders a typographic plate.
    tags: [
      "Multi-tenant SaaS",
      "Stripe Connect",
      "Artwork pipeline",
      "TypeScript",
    ],
  },
  {
    title: "Pollan",
    description:
      "A SaaS platform that lets independent sellers create products, events, and shops, all sellable with a single link.",
    role: "Backend Developer",
    href: "https://pollan.co/",
    image: "/work/pollan.webp",
    // TODO(sam): add tags, e.g. ["Node.js", "Payments", "REST API"]
  },
  {
    title: "PrintDays",
    description:
      "A print company platform, with both a customer-facing frontend and a dashboard for admins to track orders and finances.",
    role: "Full-Stack Developer",
    href: "https://printdays.co.uk/",
    image: "/work/printdays.webp",
    // TODO(sam): add tags
  },
];

export const socials = [
  { label: "GitHub", handle: "sam-uel-thomas", href: "https://github.com/sam-uel-thomas" },
  { label: "LinkedIn", handle: "in/sam-thomas-45a956293", href: "https://www.linkedin.com/in/sam-thomas-45a956293" },
];
