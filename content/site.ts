export const site = {
  name: "Sam Thomas",
  role: "Designer & Developer",
  url: "https://samthomas.dev", // used for metadata / Open Graph
  // One-line hero description. Wrap words in *asterisks* to set them in the
  // display serif italic — the accent voice. Use it sparingly, 1–2 per page.
  tagline:
    "I'm a London-based designer and *full stack* developer.",
  description:
    "I'm a designer and developer building calm, considered digital products with a focus on typography and craft.",
  email: "samuel.mmthomas@gmail.com",
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
  "Full stack development",
  "Product design",
  "Available for work",
  "London, UK",
  "Design engineering",
];

export type Testimonial = {
  quote: string;
  name: string;
  /** Role + organisation, e.g. "Founder, Loop Goods". */
  role: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  PLACEHOLDER TESTIMONIALS — lorem ipsum, obviously not real quotes.
//
// Swap in genuine ones (with permission) or empty the array before the site
// goes anywhere near a job application. The Testimonials section removes itself
// when the array is empty, so deleting is safe.
// ─────────────────────────────────────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    name: "Jane Doe",
    role: "Founder, Company",
  },
  {
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    name: "John Smith",
    role: "Director, Studio",
  },
  {
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    name: "Alex Lee",
    role: "Producer, Agency",
  },
];

export const about = {
  // Two or three sentences. Keep it editorial — confident, no filler.
  paragraphs: [
    "I’m a full-stack developer with an eye for design. I build web apps, online stores, and sites end to end — backend included.",
    "Most recently I led development on *PRNTRS*, taking a print platform white-label: multi-tenant architecture, billing, and the artwork pipeline, across both frontend and backend.",
    "Most of my work is for independent makers, artists, and small businesses who want something built well, without the agency overhead.",
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
      "A print studio operating system, built white-label out of PrintDays. Independent print businesses get their own branded storefront, artwork pipeline and fulfilment workflow — orders in, print-ready files out.",
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
      "A SaaS platform that lets independent sellers create products, events, and shops — all shareable with a single link.",
    role: "Backend Developer",
    href: "https://pollan.co/",
    image: "/work/pollan.webp",
    // TODO(sam): add tags, e.g. ["Node.js", "Payments", "REST API"]
  },
  {
    title: "PrintDays",
    description:
      "A print ordering platform built for seamless end-to-end ordering and fulfilment.",
    role: "Full-Stack Developer",
    href: "https://printdays.co.uk/",
    image: "/work/printdays.webp",
    // TODO(sam): add tags
  },
  {
    title: "Prologue Opera",
    description:
      "A site for Prologue Opera, a contemporary opera company based in the South Coast.",
    role: "Full-Stack Developer",
    href: "https://prologueopera.com/",
    image: "/work/prologue-opera.webp",
    // TODO(sam): add tags
  },
];

export const socials = [
  { label: "GitHub", handle: "sam-uel-thomas", href: "https://github.com/sam-uel-thomas" },
  { label: "LinkedIn", handle: "in/samthomas", href: "https://www.linkedin.com/" },
];
