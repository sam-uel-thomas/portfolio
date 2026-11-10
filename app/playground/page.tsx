import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Grain from "@/components/Grain";
import GridLines, { InvertedGridLines } from "@/components/GridLines";
import LocalTime from "@/components/LocalTime";
import SectionHead from "@/components/SectionHead";
import { AccentText } from "@/components/TextReveal";
import { about, heroRoll, projects, services, site } from "@/content/site";
import HeroWithWork from "./_specimens/HeroWithWork";
import LivingSplat from "./_specimens/LivingSplat";
import NowBoard from "./_specimens/NowBoard";
import { CopyEmail, RollText } from "./_specimens/RollText";
import RollingWord from "@/components/RollingWord";
import ScrubText from "@/components/ScrubText";
import ServicesSpotlight from "@/components/ServicesSpotlight";
import Specimen, { type SpecimenInfo } from "./_specimens/Specimen";
import SpringyWordmark from "@/components/SpringyWordmark";

/**
 * A scratch page for trying out ideas before they go into the real site.
 * Everything here uses the site's own components, type and motion, so a
 * specimen that earns its place can move across as-is.
 *
 * Shown in development and on Vercel preview deploys; production 404s, and
 * it's noindexed regardless. Delete the whole `app/playground` folder when
 * it's done its job.
 */
export const metadata: Metadata = {
  title: "Playground",
  robots: { index: false, follow: false },
};

const specimens = {
  splat: {
    n: "01",
    title: "The splat, *alive*.",
    kind: "Personality",
    lives: "Hero, beside your name",
    note: "Your favicon is already a paint splat, so this makes it the brand mark. It breathes and turns on its own and reshapes when you click it, and clicking anywhere else throws paint. Visitors get something to play with before they've read a word.",
  },
  rolling: {
    n: "02",
    title: "Rolling *words*.",
    kind: "Motion",
    lives: "Under the hero tagline, or as the About title",
    note: "Shows the range of what you build without making it a list. Each word rises out of the same mask the site's headings use, and the line resizes to fit it, so the full stop rides along.",
    draft: true,
  },
  roll: {
    n: "03",
    title: "Letters that *roll*.",
    kind: "Micro-interaction",
    lives: "Nav, footer links, Contact",
    note: "A small touch you'd meet everywhere: on hover, links roll over a letter at a time. The email also gets a copy button, because a mailto link does nothing for anyone who uses webmail.",
  },
  scrub: {
    n: "04",
    title: "Read at your *pace*.",
    kind: "Motion",
    lives: "About",
    note: "The About copy fills in word by word as you scroll, and empties again if you scroll back. The current reveal plays once and stops; this one follows the reader's scrolling.",
  },
  services: {
    n: "05",
    title: "Say what you *do*.",
    kind: "New section",
    lives: "Between Work and About",
    note: "The site shows what you've built but never says what someone can hire you for. Hovering a service switches it to the serif italic and brings up its detail beside the list. The rows never change height, so the list doesn't jump about under the cursor.",
    draft: true,
  },
  wordmark: {
    n: "06",
    title: "A wordmark with *bounce*.",
    kind: "Personality",
    lives: "Footer",
    note: "The last thing on the page now has some give in it. The letters spring up out of a mask when the footer arrives, then hop as the cursor runs across them, and each hop nudges the letters beside it.",
  },
  now: {
    n: "07",
    title: "What’s on *now*.",
    kind: "New section",
    lives: "Between About and Contact, or in the footer",
    note: "A small human note that changes over time: what you're building, learning and listening to. The values clatter in like a departures board, a nod to the Helvetica of station signage. Two rows need your answers.",
    draft: true,
  },
  heroWork: {
    n: "08",
    title: "The work, *up front*.",
    kind: "Hero",
    lives: "Hero, beside your name",
    note: "The hero currently shows no work at all. This stacks your three projects in the empty right half and shuffles them in step with the rolling line, so when it says “SaaS platforms” PRNTRS is the card on top. The stack leans toward the cursor, and replaces the small tagline that repeated the line beside it.",
  },
} satisfies Record<string, SpecimenInfo>;


export default function Playground() {
  // Preview deploys keep it so it can be shared for feedback; production never serves it.
  if (process.env.VERCEL_ENV === "production") notFound();

  const [first, ...rest] = site.name.split(" ");
  const list = Object.values(specimens);

  return (
    <>
      <GridLines />
      <Grain />

      <main id="main" className="relative">
        {/* ── Intro ─────────────────────────────────────────────────────── */}
        <Container className="pb-8 pt-10 md:pt-12">
          <div className="flex items-baseline justify-between">
            <Link href="/" className="group font-sans text-lg font-bold tracking-tight text-ink">
              <RollText text={`← ${site.name}`} stagger={14} />
            </Link>
            <span className="u-label">Not linked · noindex</span>
          </div>

          <div className="mt-24 grid grid-cols-4 gap-y-10 md:mt-32 md:grid-cols-12 md:gap-x-5">
            <div className="col-span-4 md:col-span-8">
              <p className="u-label mb-6 text-ink">Playground</p>
              <h1 className="font-sans text-[clamp(3rem,9vw,8.5rem)] font-bold leading-[0.88] tracking-tightest text-ink">
                <AccentText text="Eight *ideas*, all live." />
              </h1>
            </div>
            <p className="col-span-4 self-end text-lg leading-relaxed text-ink/80 md:col-span-4">
              Each one is built from the site’s own type, colour and motion code. Try them, then
              tell me which numbers to keep. Nothing here goes live until you pick it.
            </p>
          </div>

          <ol className="mt-20 border-t border-ink/15 md:mt-28">
            {list.map((item) => (
              <li key={item.n} className="border-b border-ink/15">
                <a
                  href={`#specimen-${item.n}`}
                  className="group grid grid-cols-4 items-baseline gap-x-5 py-4 md:grid-cols-12"
                >
                  <span className="u-label col-span-1">{item.n}</span>
                  <span className="col-span-3 text-lg font-medium tracking-tight text-ink md:col-span-6">
                    <RollText text={item.title.replace(/\*/g, "")} stagger={10} />
                  </span>
                  <span className="u-label col-span-4 hidden md:col-span-2 md:block">
                    {item.kind}
                  </span>
                  <span className="u-label col-span-3 hidden text-right md:block">{item.lives}</span>
                </a>
              </li>
            ))}
          </ol>
        </Container>

        {/* ── 01 ───────────────────────────────────────────────────────── */}
        <Specimen info={specimens.splat}>
          <LivingSplat first={first} last={rest.join(" ")} />
        </Specimen>

        {/* ── 02 ───────────────────────────────────────────────────────── */}
        <Specimen info={specimens.rolling}>
          <div className="border border-ink/15 px-6 py-20 md:px-12 md:py-28">
            <RollingWord
              lead={heroRoll.lead}
              words={heroRoll.words.map((item) => item.word)}
              className="font-sans text-[clamp(2.25rem,5.5vw,5rem)] font-bold leading-[0.95] tracking-tightest text-ink"
            />
          </div>
        </Specimen>

        {/* ── 03 ───────────────────────────────────────────────────────── */}
        <Specimen info={specimens.roll}>
          <div className="border border-ink/15">
            {/* A stand-in header bar, so the nav reads in context. */}
            <div className="flex h-14 items-center justify-between border-b border-ink/15 px-5 sm:px-8">
              <span className="font-sans text-lg font-bold tracking-tight text-ink">{site.name}</span>
              <nav className="flex items-center gap-4 sm:gap-7">
                {["Work", "Services", "About", "Contact"].map((label) => (
                  <a key={label} href={`#specimen-03`} className="group u-label hover:text-ink">
                    <RollText text={label} />
                  </a>
                ))}
              </nav>
            </div>
            <div className="px-5 py-16 sm:px-8 md:py-24">
              <p className="u-label mb-6">Contact</p>
              <CopyEmail email={site.email} />
            </div>
          </div>
        </Specimen>

        {/* ── 04 ───────────────────────────────────────────────────────── */}
        <Specimen info={specimens.scrub} bleed>
          <div className="relative rounded-t-[1.75rem] bg-ink py-[24vh] text-paper md:rounded-t-[2.5rem]">
            <InvertedGridLines />
            <Container className="relative">
              <div className="grid grid-cols-4 md:grid-cols-12 md:gap-x-5">
                <ScrubText
                  paragraphs={about.paragraphs}
                  className="col-span-4 font-sans text-[clamp(1.75rem,3.4vw,3.25rem)] font-medium leading-[1.12] tracking-tight md:col-span-10"
                />
              </div>
            </Container>
          </div>
        </Specimen>

        {/* ── 05 ───────────────────────────────────────────────────────── */}
        <Specimen info={specimens.services}>
          <SectionHead
            label="Services"
            title="From first sketch to *shipped*."
            meta={`(${String(services.length).padStart(2, "0")})`}
          />
          <ServicesSpotlight services={services} />
        </Specimen>

        {/* ── 06 ───────────────────────────────────────────────────────── */}
        <Specimen info={specimens.wordmark} bleed>
          <div className="bg-ink text-paper">
            <Container className="py-12 md:py-16">
              <p className="u-label text-paper/40">Run the cursor along the letters</p>
              <div className="mt-10 md:mt-16">
                <SpringyWordmark text={site.name} />
              </div>
              <div className="mt-10 grid grid-cols-4 gap-y-2 border-t border-paper/15 pt-6 md:grid-cols-12">
                <span className="u-label col-span-2 text-paper/50 md:col-span-4">
                  © {new Date().getFullYear()} {site.name}
                </span>
                <LocalTime className="u-label col-span-4 hidden text-center text-paper/50 md:block" />
                <span className="u-label col-span-2 text-right text-paper/50 md:col-span-4">
                  {site.location}
                </span>
              </div>
            </Container>
          </div>
        </Specimen>

        {/* ── 07 ───────────────────────────────────────────────────────── */}
        <Specimen info={specimens.now}>
          <div className="mb-8 flex items-baseline justify-between">
            <span className="u-label text-ink">Now</span>
            <span className="u-label">Updated Nov 2026</span>
          </div>
          <NowBoard
            available={site.available}
            availabilityLabel={site.availabilityLabel}
            rows={[
              { label: "Building", value: "PRNTRS, a print studio operating system" },
              { label: "Learning", value: "", placeholder: "Something you’re learning" },
              { label: "Listening to", value: "", placeholder: "An album on repeat" },
            ]}
          />
        </Specimen>

        {/* ── 08 ───────────────────────────────────────────────────────── */}
        <Specimen info={specimens.heroWork}>
          <HeroWithWork
            first={first}
            last={rest.join(" ")}
            lead={heroRoll.lead}
            words={heroRoll.words}
            cards={projects.flatMap((project) =>
              project.image ? [{ title: project.title, image: project.image }] : [],
            )}
          />
        </Specimen>

        <Container className="pb-24 pt-8">
          <div className="border-t border-ink/15 pt-5">
            <p className="u-label">End of the playground. Pick by number.</p>
          </div>
        </Container>
      </main>
    </>
  );
}
