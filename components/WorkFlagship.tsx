import CaseFigure from "@/components/CaseFigure";
import { TransitionLink } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import type { Project } from "@/content/site";

/**
 * The work, ranked: one flagship project at full width with its headline
 * numbers, and the rest as a pair of smaller cards beneath it.
 *
 * The flagship is the first project with a case study (or simply the first
 * project), so giving another project a case study and moving it up the list
 * is all it takes to promote it.
 */

/** The work screenshots are all captured at this size; it sets the frame's shape. */
const SHOT = { width: 2858, height: 1800 };

function ProjectLink({
  project,
  className,
  children,
}: {
  project: Project;
  className?: string;
  children: React.ReactNode;
}) {
  if (project.caseStudy) {
    return (
      <TransitionLink
        href={`/work/${project.caseStudy.slug}`}
        label={project.title}
        className={className}
      >
        {children}
      </TransitionLink>
    );
  }
  if (project.href.startsWith("http")) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return <div className={className}>{children}</div>;
}

function Action({ project }: { project: Project }) {
  const label = project.caseStudy
    ? "Read the case study"
    : project.href.startsWith("http")
      ? "Visit the site"
      : null;
  if (!label) return null;
  return (
    <ProjectLink
      project={project}
      className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
    >
      <span className="u-underline">{label}</span>
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-editorial group-hover:translate-x-1"
      >
        {project.caseStudy ? "→" : "↗"}
      </span>
    </ProjectLink>
  );
}

function Shot({ project }: { project: Project }) {
  if (!project.image) return null;
  return (
    <ProjectLink project={project} className="group block">
      <span className="sr-only">{project.title}</span>
      <div className="transition-transform duration-700 ease-editorial group-hover:scale-[1.012]">
        <CaseFigure
          image={{ src: project.image, alt: "", width: SHOT.width, height: SHOT.height }}
        />
      </div>
    </ProjectLink>
  );
}

export default function WorkFlagship({ projects }: { projects: Project[] }) {
  const leadIndex = Math.max(
    0,
    projects.findIndex((project) => project.caseStudy),
  );
  const lead = projects[leadIndex];
  const rest = projects.filter((_, i) => i !== leadIndex);
  const stats = lead.caseStudy?.stats ?? [];

  return (
    <div>
      {/* ── The flagship ─────────────────────────────────────────────── */}
      <article>
        <Shot project={lead} />

        <div className="mt-10 grid grid-cols-4 gap-y-8 md:mt-14 md:grid-cols-12 md:gap-x-5">
          <div className="col-span-4 md:col-span-5">
            <Reveal>
              <p className="u-label">{lead.role}</p>
            </Reveal>
            <TextReveal
              as="h3"
              text={lead.title}
              stagger={55}
              className="mt-4 block font-sans text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-tightest text-ink"
            />
          </div>

          <Reveal delay={120} className="col-span-4 md:col-span-4 md:col-start-6 md:pt-8">
            <p className="max-w-md text-base leading-relaxed text-ink/75">{lead.description}</p>
            <div className="mt-6">
              <Action project={lead} />
            </div>
          </Reveal>

          {/* The case study's own headline numbers, so the proof is on the
              home page too, not one click away. */}
          {stats.length ? (
            <dl className="col-span-4 space-y-5 md:col-span-3 md:col-start-10 md:pt-8">
              {stats.map((stat, i) => (
                // The term comes first in the markup, as a list of terms
                // should, and the figure is lifted above it visually.
                <Reveal
                  key={stat.label}
                  delay={200 + i * 80}
                  className="flex flex-col-reverse border-t border-ink/15 pt-3"
                >
                  <dt className="mt-1 text-sm leading-snug text-muted">{stat.label}</dt>
                  <dd className="whitespace-nowrap font-sans text-2xl font-bold tracking-tight text-ink">
                    {stat.value}
                  </dd>
                </Reveal>
              ))}
            </dl>
          ) : null}
        </div>
      </article>

      {/* ── The pair ─────────────────────────────────────────────────── */}
      {rest.length ? (
        <div className="mt-24 grid grid-cols-4 gap-y-20 md:mt-36 md:grid-cols-12 md:gap-x-5">
          {rest.map((project, i) => (
            <article
              key={project.title}
              // The second card drops a little, so the pair reads as two
              // placed things rather than a row of equal tiles.
              className={`col-span-4 md:col-span-6 ${i % 2 === 1 ? "md:mt-24" : ""}`}
            >
              <Shot project={project} />
              <Reveal className="mt-6">
                <p className="u-label">{project.role}</p>
              </Reveal>
              <TextReveal
                as="h3"
                text={project.title}
                stagger={55}
                className="mt-3 block font-sans text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[0.95] tracking-tightest text-ink"
              />
              <Reveal delay={120}>
                <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75">
                  {project.description}
                </p>
                <div className="mt-5">
                  <Action project={project} />
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
