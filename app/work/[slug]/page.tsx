import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseFigure from "@/components/CaseFigure";
import Container from "@/components/Container";
import Magnetic from "@/components/Magnetic";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import SectionLink from "@/components/SectionLink";
import SpringyWordmark from "@/components/SpringyWordmark";
import TextReveal from "@/components/TextReveal";
import { projects, site } from "@/content/site";

type Params = { params: { slug: string } };

/** Every project with a case study, in work-index order. */
const studies = projects.flatMap((project, index) =>
  project.caseStudy ? [{ project, study: project.caseStudy, index }] : [],
);

// Only the slugs in content/site.ts exist; anything else is a 404 at build
// time rather than a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return studies.map(({ study }) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const found = studies.find(({ study }) => study.slug === params.slug);
  if (!found) return {};
  const { project, study } = found;
  const title = `${project.title} — Case study`;
  const url = `/work/${study.slug}`;

  return {
    title,
    description: project.description,
    // The root layout names "/" as canonical, and a child page inherits that
    // unless it says otherwise — which would tell search engines this page is
    // a duplicate of the home page.
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${site.name}`,
      description: project.description,
      url,
      siteName: site.name,
      type: "article",
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description: project.description,
    },
  };
}

/** "https://prntrs.co/" → "prntrs.co" */
function displayHost(href: string) {
  return href.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export default function CaseStudyPage({ params }: Params) {
  const found = studies.find(({ study }) => study.slug === params.slug);
  if (!found) notFound();
  const { project, study } = found;
  const isLive = project.href.startsWith("http");

  const facts = [
    { label: "Role", value: project.role },
    { label: "Year", value: study.year },
    ...(project.tags?.length ? [{ label: "Scope", value: project.tags.join(", ") }] : []),
  ];

  return (
    <PageShell>
      <article>
        {/* ── Title ─────────────────────────────────────────────────────── */}
        <section id="top" className="relative pt-14">
          <Container className="pb-12 pt-14 md:pb-16 md:pt-20">
            <Reveal start="intro">
              <div className="flex items-baseline justify-between border-b border-ink/15 pb-4">
                <SectionLink
                  section="work"
                  className="group u-label inline-flex items-center gap-2 transition-colors duration-300 hover:text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-editorial group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                  All work
                </SectionLink>
                <span className="u-label text-ink">Case study</span>
              </div>
            </Reveal>

            {/* The same springy letters as the footer wordmark, so the page
                opens on the site's signature gesture: they rise as the page
                arrives and lift under the cursor. Long names step down a
                size so they stay on one line. */}
            <h1 className="mt-4 md:mt-6">
              <SpringyWordmark
                text={project.title}
                waitForIntro
                typeClassName={`text-left font-sans font-bold leading-[0.84] tracking-tightest text-ink ${
                  project.title.length > 6
                    ? "text-[min(12vw,12rem)]"
                    : "text-[min(18vw,17rem)]"
                }`}
              />
            </h1>

            <div className="mt-10 grid grid-cols-4 gap-y-10 md:mt-16 md:grid-cols-12 md:items-end md:gap-x-5">
              <TextReveal
                as="p"
                text={study.headline}
                start="intro"
                delay={320}
                stagger={40}
                className="col-span-4 font-sans text-[clamp(1.75rem,3.4vw,3.25rem)] font-medium leading-[1.05] tracking-tight text-ink md:col-span-7"
              />

              <Reveal start="intro" delay={620} className="col-span-4 md:col-span-4 md:col-start-9">
                <dl className="border-t border-ink/15">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="grid grid-cols-4 items-baseline gap-x-5 border-b border-ink/15 py-3"
                    >
                      <dt className="u-label col-span-1">{fact.label}</dt>
                      <dd className="col-span-3 text-sm leading-relaxed text-ink">{fact.value}</dd>
                    </div>
                  ))}
                  {isLive ? (
                    <div className="grid grid-cols-4 items-baseline gap-x-5 border-b border-ink/15 py-3">
                      <dt className="u-label col-span-1">Live</dt>
                      <dd className="col-span-3 text-sm text-ink">
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="u-underline"
                        >
                          {displayHost(project.href)} ↗
                        </a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </Reveal>
            </div>
          </Container>

          <Container>
            <CaseFigure image={study.cover} start="intro" />
          </Container>
        </section>

        {/* ── My role ────────────────────────────────────────────────────────
            The page leads with what you did, because that's what someone
            reading a case study came for. What the product is gets one line,
            set quietly underneath. */}
        <Section id="role">
          <div className="grid grid-cols-4 gap-y-10 md:grid-cols-12 md:gap-x-5">
            <Reveal className="col-span-4 md:col-span-3">
              <p className="u-label border-t border-ink/15 pt-4 text-ink md:border-0 md:pt-2">
                My role
              </p>
              <ul className="mt-6 hidden space-y-2 md:block">
                {study.responsibilities.map((item) => (
                  <li key={item} className="text-base text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <div className="space-y-6">
                {study.role.map((paragraph, i) => (
                  <Reveal
                    key={i}
                    as="p"
                    delay={i * 80}
                    className={
                      i === 0
                        ? "font-sans text-[clamp(1.5rem,2.4vw,2.15rem)] font-medium leading-snug tracking-tight text-ink"
                        : "max-w-2xl text-lg leading-relaxed text-ink/80"
                    }
                  >
                    {paragraph}
                  </Reveal>
                ))}
              </div>

              {/* On phones the responsibilities sit under the role, as a
                  wrapped line rather than a column. */}
              <Reveal delay={160} className="mt-8 md:hidden">
                <ul className="flex flex-wrap gap-2">
                  {study.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="border border-ink/15 px-3 py-1 text-sm text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={200} className="mt-12 border-t border-ink/15 pt-5 md:mt-16">
                <p className="u-label mb-3">The product</p>
                <p className="max-w-2xl text-base leading-relaxed text-ink/70">{study.context}</p>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* ── The product ───────────────────────────────────────────────── */}
        <section id="product" className="relative pb-24 md:pb-32">
          <Container className="space-y-24 md:space-y-40">
            {study.features.map((feature, i) => {
              // Alternate sides, so the page zigzags instead of stacking.
              const flipped = i % 2 === 1;
              return (
                <div
                  key={feature.label}
                  className="grid grid-cols-4 gap-y-10 md:grid-cols-12 md:items-end md:gap-x-5"
                >
                  <div
                    className={`col-span-4 md:col-span-4 ${
                      flipped ? "md:order-2 md:col-start-9" : ""
                    }`}
                  >
                    <Reveal>
                      <p className="u-label border-t border-ink/15 pt-4 text-ink">{feature.label}</p>
                    </Reveal>
                    <TextReveal
                      as="h2"
                      text={feature.title}
                      stagger={55}
                      className="mt-6 block font-sans text-[clamp(2rem,3.6vw,3.5rem)] font-bold leading-[0.95] tracking-tightest text-ink"
                    />
                    <Reveal delay={120} className="mt-6 max-w-md space-y-4">
                      {feature.body.map((paragraph, j) => (
                        <p key={j} className="text-base leading-relaxed text-ink/80">
                          {paragraph}
                        </p>
                      ))}
                    </Reveal>
                  </div>

                  <CaseFigure
                    image={feature.image}
                    className={`col-span-4 md:col-span-7 ${
                      flipped ? "md:order-1 md:col-start-1" : "md:col-start-6"
                    }`}
                  />
                </div>
              );
            })}
          </Container>
        </section>

        {/* ── Design and interaction ────────────────────────────────────────
            Same shape as the build list below, in the light tone, so the two
            read as a pair: how it feels, then how it's made. */}
        {study.interaction ? (
          <Section id="interaction" className="pt-0 md:pt-0">
            <SectionHead
              label="Design and interaction"
              title={study.interaction.title}
              titleSpan="lg:col-span-8"
            />
            <ol className="grid grid-cols-4 md:grid-cols-12 md:gap-x-5">
              {study.interaction.items.map((item, i) => (
                <Reveal
                  key={item.title}
                  as="li"
                  delay={(i % 2) * 90}
                  className="col-span-4 border-t border-ink/15 py-8 md:col-span-6 md:py-10"
                >
                  <h3 className="font-sans text-2xl font-medium tracking-tight text-ink md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-ink/70">
                    {item.body}
                  </p>
                </Reveal>
              ))}
            </ol>
          </Section>
        ) : null}

        {/* ── The build ─────────────────────────────────────────────────── */}
        <Section id="build" tone="ink">
          <SectionHead
            label="The build"
            title={study.build.title}
            titleSpan="lg:col-span-8"
            dark
          />
          {/* The headline numbers, before the detail: someone skimming gets
              the result in three figures, and the list below says how. */}
          {study.stats?.length ? (
            <dl className="mb-16 grid grid-cols-4 gap-y-10 md:mb-24 md:grid-cols-12 md:gap-x-5">
              {study.stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={i * 90}
                  className="col-span-4 flex flex-col-reverse border-t border-paper/20 pt-5"
                >
                  <dt className="mt-3 max-w-[18rem] text-sm leading-snug text-paper/60">
                    {stat.label}
                  </dt>
                  <dd className="whitespace-nowrap font-sans text-[clamp(2.25rem,4.4vw,4.25rem)] font-bold leading-none tracking-tightest text-paper">
                    {stat.value}
                  </dd>
                </Reveal>
              ))}
            </dl>
          ) : null}

          <ol className="grid grid-cols-4 md:grid-cols-12 md:gap-x-5">
            {study.build.items.map((item, i) => (
              <Reveal
                key={item.title}
                as="li"
                delay={(i % 2) * 90}
                className="col-span-4 border-t border-paper/20 py-8 md:col-span-6 md:py-10"
              >
                <div>
                  <h3 className="font-sans text-2xl font-medium tracking-tight text-paper md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-paper/60">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Section>

        {/* ── Where it stands ───────────────────────────────────────────── */}
        <Section id="live">
          <SectionHead
            label={isLive ? "Live" : "Status"}
            title={isLive ? "See it *running*." : "Coming *soon*."}
            titleSpan="lg:col-span-8"
          />
          <div className="grid grid-cols-4 gap-y-10 md:grid-cols-12 md:gap-x-5">
            {isLive ? (
              <div className="col-span-4 md:col-span-12">
                <Reveal>
                  <Magnetic strength={0.18} padding={20} className="inline-block">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex max-w-full items-baseline gap-3 break-words font-sans text-[clamp(2.25rem,9vw,8rem)] font-bold leading-[0.95] tracking-tightest text-ink"
                    >
                      <span className="u-underline pb-1">{displayHost(project.href)}</span>
                      <span
                        aria-hidden="true"
                        className="text-2xl transition-transform duration-500 ease-editorial group-hover:translate-x-1 sm:text-4xl"
                      >
                        ↗
                      </span>
                    </a>
                  </Magnetic>
                </Reveal>
              </div>
            ) : null}
            <Reveal delay={100} className="col-span-4 space-y-4 md:col-span-5">
              {study.outcome.map((paragraph, i) => (
                <p key={i} className="text-lg leading-relaxed text-ink/80">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>

        </Section>

        {/* ── Closing ───────────────────────────────────────────────────────
            Just the way back to the rest of the work. Getting in touch is the
            footer's job, directly below, so the page doesn't ask twice. */}
        <section id="next" className="relative pb-16 md:pb-24">
          <Container>
            <div>
              <Reveal>
                {/* Back to the top is left to the footer just below, which
                    already has one. */}
                <div className="border-t border-ink/15 pt-6">
                  <SectionLink
                    section="work"
                    className="group u-label inline-flex items-center gap-2 transition-colors duration-300 hover:text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 ease-editorial group-hover:-translate-x-1"
                    >
                      ←
                    </span>
                    All work
                  </SectionLink>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      </article>
    </PageShell>
  );
}
