export const site = {
  name: "Sam Thomas",
  role: "Designer & Developer",
  url: "https://samthomas.dev", // used for metadata / Open Graph
  // One-line hero description.
  tagline:
    "I'm a London-based designer and full stack developer.",
  description:
    "I'm a designer and developer building calm, considered digital products with a focus on typography and craft.",
  email: "samuel.mmthomas@gmail.com",
  location: "London, UK",
  available: true,
  availabilityLabel: "Available for work",
};

export type Testimonial = {
  quote: string;
  name: string;
  /** Role + organisation, e.g. "Founder, Loop Goods". */
  role: string;
};

// ── Placeholder testimonials — swap these for the real ones. ──────────────────
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
  href: string;
  /** Preview image shown on hover (desktop) / inline (mobile). */
  image: string;
};

export const projects: Project[] = [
  {
    title: "Pollan",
    description:
      "A SaaS platform that lets independent sellers create products, events, and shops — all shareable with a single link.",
    role: "Backend Developer",
    href: "https://pollan.co/",
    image: "/work/pollan.webp",
  },
  {
    title: "PrintDays",
    description:
      "A print ordering platform built for seamless end-to-end ordering and fulfilment.",
    role: "Full-Stack Developer",
    href: "https://printdays.co.uk/",
    image: "/work/printdays.webp",
  },
  {
    title: "Prologue Opera",
    description:
      "A site for Prologue Opera, a contemporary opera company based in the South Coast.",
    role: "Full-Stack Developer",
    href: "https://prologueopera.com/",
    image: "/work/prologue-opera.webp",
  },
];

export const socials = [
  { label: "GitHub", handle: "sam-uel-thomas", href: "https://github.com/sam-uel-thomas" },
  { label: "LinkedIn", handle: "in/samthomas", href: "https://www.linkedin.com/" },
];
