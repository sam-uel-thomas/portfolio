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
    "Most recently I worked with the team behind *PRNTRS*, a platform for running a print studio online, to take it from a stalled project to production.",
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
  /**
   * Show it as it is, with no mount. For images that are already composed on
   * white, like product illustrations: a frame around those reads as a
   * screenshot of a screenshot. Leave it off for whole pages, which need an
   * edge.
   */
  bare?: boolean;
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
  /**
   * Your part, in the first person. This leads the page: a case study is
   * read to find out what you did, so the product only gets a line of
   * context below it. The first paragraph is set large.
   */
  role: string[];
  /** What you owned, as short labels. Listed beside the role. */
  responsibilities: string[];
  /** One or two sentences on what the product is. Kept deliberately short. */
  context: string;
  /**
   * Headline numbers, shown large at the top of the build section. Before
   * and after reads best ("680 → 96 KB"). Three fit a row.
   */
  stats?: { value: string; label: string }[];
  /** Parts of the product you built, each with a screenshot. */
  features: {
    label: string;
    title: string;
    body: string[];
    image: CaseImage;
  }[];
  /** Design and interaction work, shown as its own section after the features. */
  interaction?: {
    title: string;
    items: { title: string; body: string }[];
  };
  /** How you built it: the engineering and the decisions, in plain words. */
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
      "A platform for running a print studio online. I joined a stalled project and worked with the team to take it to production: team accounts, billing and storefront themes, then security testing, speed and smoother interaction across the product.",
    role: "Software Engineer",
    href: "https://prntrs.co/",
    image: "/work/prntrs.webp",
    tags: ["Performance", "Security", "Testing", "Interaction design"],
    // Every claim and number below comes from the PRNTRS repo's history and
    // commit notes (H:\Work\10 Clients\PRNTRS\prntrs-app), from July 2026 on.
    // The security work is described by its shape, not its findings: this is
    // a public page about a client's live product, so it doesn't say what was
    // exposed. Keep it that way.
    // The layout-shift figures were measured in the sandbox, not on the live
    // site. Fine to quote as before and after, but worth knowing.
    caseStudy: {
      slug: "prntrs",
      year: "2026",
      headline: "Bringing a stalled project to *production*.",
      cover: {
        src: "/work/prntrs.webp",
        alt: "The PRNTRS home page: the headline “The new way to run a print studio” above an example studio storefront selling fine art prints.",
        width: 2858,
        height: 1800,
      },
      role: [
        "When I joined PRNTRS in July 2026 it had stalled. I worked with the team to find the best route forward, and to decide which features would make it ready for studios to pay for.",
        "After a push on development, building team accounts and an activity log, plans and billing, a product shop and storefront themes, my focus moved to security testing and improving the experience across the whole product.",
      ],
      responsibilities: [
        "Team accounts and activity log",
        "Security testing",
        "UX and motion",
        "Performance",
        "Testing",
        "Billing and plans",
        "Storefront themes",
      ],
      context:
        "PRNTRS lets independent print studios take orders online under their own name: a branded storefront for their customers, and a back office for the studio.",
      stats: [
        { value: "680 → 96 KB", label: "First download, after splitting the app" },
        { value: "0.49 → 0.002", label: "Worst layout shift on a storefront page" },
        { value: "0 → 1,400+", label: "Tests in the suite I started, about 520 of them mine" },
      ],
      features: [
        {
          label: "Team accounts",
          title: "Built for a *team*.",
          body: [
            "I built team accounts, the part of PRNTRS I’m proudest of. An owner invites their staff and gives each a role, and every permission is checked on the server, not just hidden on screen.",
            "Alongside it I built the activity log, which records who did what across orders, money and data exports, so an owner can always see what changed and who changed it.",
            "I also gave orders search and paging on the server, and job tickets and packing slips in each studio’s own branding.",
          ],
          image: {
            src: "/work/prntrs/dashboard.webp",
            alt: "The PRNTRS studio dashboard, showing revenue, profit after shipping, Stripe balance and pending payout for the month.",
            width: 2624,
            height: 1344,
            bare: true,
          },
        },
        {
          label: "Print engine",
          title: "Prints that *match* the file.",
          body: [
            "I fixed the print engine behind the creator: phone photos printed sideways, photos from higher-end cameras printed with a colour shift, and artwork it couldn’t print slipped through. It now turns those files away at upload instead.",
            "Each fix went in behind a test that pinned the old behaviour first, so the change was deliberate and nothing else moved with it.",
          ],
          image: {
            src: "/work/prntrs/creator.webp",
            alt: "The PRNTRS print creator: an uploaded artwork with size, paper, border and quantity options, and an add to cart button showing the price.",
            width: 1480,
            height: 1360,
            bare: true,
          },
        },
      ],
      interaction: {
        title: "Making it feel *right*.",
        items: [
          {
            title: "Motion that explains",
            body: "I brought smooth, restrained motion to the homepage, the dashboard and the storefronts, only where it explains a change: panels ease open, selections glide between options, figures ease to new values, and new orders slide in. Reduced motion turns it all off.",
          },
          {
            title: "Loading without the jumps",
            body: "Spinners and “Loading…” text became placeholders shaped like the content on its way, tinted to each store’s own colours, so pages settle in rather than snap into place.",
          },
          {
            title: "Themes that hold any colour",
            body: "I built storefront themes from a mix of my own designs and supplied prototypes, then made each one hold up under whatever colours a studio picks for it.",
          },
          {
            title: "The small things",
            body: "Phone menus, the Store Editor and FAQ answers ease open and shut, the Creator’s sheet glides to a new size, and the homepage bar slides away as you read and returns when you scroll back.",
          },
        ],
      },
      build: {
        title: "Making it fast and *safe*.",
        items: [
          {
            title: "A safety net first",
            body: "There were no automated tests when I joined. I set the suite up in my first week with 89, around money, plan access and the walls between studios, running on every change. It’s now over 1,400, about 520 of them mine.",
          },
          {
            title: "A security test pass",
            body: "I ran a security test pass across the platform, probing nine suspected issues around access between studios and within teams. I fixed the ones that proved real, each with a test so it stays fixed.",
          },
          {
            title: "A smaller first load",
            body: "Every visitor downloaded the whole app, dashboard and all four themes, in one 2.4 MB script. I split it so each page loads only what it needs, and the first download fell from 680 KB to 96 KB.",
          },
          {
            title: "Pages that hold still",
            body: "Storefront pages jumped as their content arrived. I changed how each page and its data load together, and the worst layout-shift score went from 0.49 to 0.002.",
          },
          {
            title: "Lighter images and fonts",
            body: "The homepage loaded about 7 MB of images, one of them a 3.3 MB gradient. Re-encoded, the whole site’s images now come to about 2 MB, and the brand font dropped from 120 KB files to 56 KB.",
          },
          {
            title: "Bigger stores, same speed",
            body: "The customer list loaded every order a store had ever taken, in full. It now pages on the server, 50 at a time, with tests proving the totals come out identical.",
          },
        ],
      },
      outcome: ["PRNTRS is live, and every change to it now runs against the tests first."],
    },
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
