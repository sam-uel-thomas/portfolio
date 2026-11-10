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

/**
 * The hero subheading: a fixed lead, then a last word that rolls through the
 * list. Keep the words short and parallel — they all have to finish the same
 * sentence, and the longest one sets how far the line can grow.
 */
export const heroRoll = {
  lead: "I design and build",
  // `shows` is the title of the project that backs the word up: the hero
  // brings that project's screenshot to the front while the word is showing.
  // It has to match a title in `projects` below.
  words: [
    { word: "web apps", shows: "PrintDays" },
    { word: "online shops", shows: "Pollan" },
    { word: "SaaS platforms", shows: "PRNTRS" },
    { word: "dashboards", shows: "PrintDays" },
    { word: "storefronts", shows: "PRNTRS" },
  ],
};

export type Service = {
  title: string;
  /** One sentence. Shown in the detail panel, and inline on touch. */
  summary: string;
  /** What someone actually gets — short, noun-first. Two columns, so even counts sit best. */
  deliverables: string[];
};

// TODO(sam): first-draft copy — rewrite in your own words.
export const services: Service[] = [
  {
    title: "Design",
    summary:
      "Interfaces and sites designed by the person who’ll build them, so nothing gets lost in the handover.",
    deliverables: ["Interface design", "Design systems", "Prototypes", "Figma to code"],
  },
  {
    title: "Frontend",
    summary:
      "Fast, responsive front ends in React and Next.js, with the motion and detail that make them feel finished.",
    deliverables: ["Next.js sites", "Web apps", "Interaction & motion", "Performance"],
  },
  {
    title: "Backend",
    summary:
      "APIs, databases, auth and the admin dashboards that keep a business running behind the scenes.",
    deliverables: ["APIs", "Databases", "Auth & accounts", "Admin dashboards"],
  },
  {
    title: "E-commerce",
    summary:
      "Storefronts and checkouts on Stripe, from a single product up to a multi-tenant platform.",
    deliverables: ["Storefronts", "Stripe & Connect", "Order management", "Multi-tenant SaaS"],
  },
];

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

export type CaseImage = {
  src: string;
  alt: string;
  /** Intrinsic pixel size, so the page reserves the space before it loads. */
  width: number;
  height: number;
};

/**
 * The long version of a project. Giving a project one of these creates its
 * page at /work/<slug>, and the row in the work index links there instead of
 * straight out to the live site.
 */
export type CaseStudy = {
  slug: string;
  year: string;
  /** The statement under the title. Wrap a run in *asterisks* for the accent. */
  headline: string;
  /** The opening image, shown full width under the title. */
  cover: CaseImage;
  /** Two or three short paragraphs: what it is, and what your part was. */
  overview: string[];
  /** Parts of the product worth showing, each with a screenshot. */
  features: {
    label: string;
    title: string;
    body: string[];
    image: CaseImage;
  }[];
  /** What you actually built — the engineering, in plain words. */
  build: {
    title: string;
    items: { title: string; body: string }[];
  };
  /** A closing line or two on where it stands now. */
  outcome: string[];
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
  /** Optional long-form page. See CaseStudy above. */
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    title: "PRNTRS",
    description:
      "A platform for running a print studio online, built white-label out of PrintDays. Each studio gets its own branded storefront, where customers upload artwork and choose paper, size and borders, and a dashboard that follows every order from payment to dispatch.",
    role: "Lead Developer",
    href: "https://prntrs.co/",
    image: "/work/prntrs.webp",
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
