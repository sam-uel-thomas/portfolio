import CaseFigure from "@/components/CaseFigure";
import { TransitionLink } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import type { CaseImage, Project } from "@/content/site";

/**
 * The work, ranked, and sized to what each project has to say.
 *
 * The lead project gets its name, its story and its headline numbers beside
 * one picture, so all of it fits a laptop screen together. The picture is the
 * case study's first feature, a part of the product the work was on, rather
 * than the product's own homepage, which the hero already shows.
 *
 * The rest are a compact list: a thumbnail, the name, the role and a line.
 * Give another project a case study and move it up the list, and it takes
 * the lead.
 */

/** The work screenshots are all captured at this size. */
const SHOT = { width: 2858, height: 1800 };

/** Colours for each ground it can sit on. */
const TONES = {
  light: {
    text: "text-ink",
    body: "text-ink/75",
    muted: "",
    rule: "border-ink/15",
    mat: "bg-canvas",
    matEdge: "border-ink/10",
  },
  dark: {
    text: "text-paper",
    body: "text-paper/70",
    // The labels' usual grey is too dim on ink to read at their size.
    muted: "text-paper/60",
    rule: "border-paper/15",
    mat: "bg-paper/[0.06]",
    matEdge: "border-paper/10",
  },
};

type Tone = keyof typeof TONES;

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

function actionFor(project: Project) {
  if (project.caseStudy) return { label: "Read the case study", glyph: "→" };
  if (project.href.startsWith("http")) return { label: "Visit the site", glyph: "↗" };
  return null;
}

/** The words of an action. Not a link itself, so it can sit inside one. */
function ActionLabel({ project, tone }: { project: Project; tone: Tone }) {
  const action = actionFor(project);
  if (!action) return null;
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${TONES[tone].text}`}>
      <span className="u-underline">{action.label}</span>
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-editorial group-hover:translate-x-1"
      >
        {action.glyph}
      </span>
    </span>
  );
}

function leadPicture(project: Project): CaseImage | null {
  const feature = project.caseStudy?.features[0]?.image;
  // Mounted, even if the case study shows it bare: cropped, it needs an edge.
  if (feature) return { ...feature, alt: "", bare: false };
  return project.image ? { src: project.image, alt: "", ...SHOT } : null;
}

export default function WorkLead({
  projects,
  tone = "light",
}: {
  projects: Project[];
  /** The ground it sits on: the page's white, or a dark (ink) section. */
  tone?: Tone;
}) {
  const t = TONES[tone];
  const leadIndex = Math.max(
    0,
    projects.findIndex((project) => project.caseStudy),
  );
  const lead = projects[leadIndex];
  const rest = projects.filter((_, i) => i !== leadIndex);
  const stats = lead.caseStudy?.stats ?? [];
  const picture = leadPicture(lead);

  return (
    <div>
      {/* ── The lead ─────────────────────────────────────────────────── */}
      <article className="grid grid-cols-4 gap-y-10 lg:grid-cols-12 lg:gap-x-5">
        {picture ? (
          <ProjectLink
            project={lead}
            className="group col-span-4 block lg:col-span-7 lg:col-start-6 lg:row-start-1"
          >
            <span className="sr-only">{lead.title}</span>
            <div className="transition-transform duration-700 ease-editorial group-hover:scale-[1.012]">
              {/* The right of the dashboard is the interface; the left is
                  the gradient it sits on. */}
              <CaseFigure
                image={picture}
                tone={tone}
                crop={{ aspect: "4 / 3", position: "100% 50%" }}
              />
            </div>
          </ProjectLink>
        ) : null}

        <div className="col-span-4 lg:col-span-5 lg:row-start-1 lg:pr-6">
          <Reveal>
            <p className={`u-label ${t.muted}`}>
              {lead.caseStudy ? "Case study · " : ""}
              {lead.role}
            </p>
          </Reveal>
          <TextReveal
            as="h3"
            text={lead.title}
            stagger={55}
            className={`mt-4 block font-sans text-[clamp(3.5rem,8vw,8rem)] font-bold leading-[0.86] tracking-tightest ${t.text}`}
          />
          <Reveal delay={120}>
            <p className={`mt-6 max-w-md text-base leading-relaxed ${t.body}`}>
              {lead.description}
            </p>
          </Reveal>

          {/* The case study's own headline numbers, so the proof is on the
              home page too, not one click away. */}
          {stats.length ? (
            <dl className={`mt-10 border-b ${t.rule}`}>
              {stats.map((stat, i) => (
                // The term comes first in the markup, as a list of terms
                // should, and the figure is lifted above it visually.
                <Reveal
                  key={stat.label}
                  delay={200 + i * 80}
                  className={`flex flex-col-reverse border-t py-3 ${t.rule}`}
                >
                  <dt className={`mt-0.5 text-sm leading-snug ${t.muted || "text-muted"}`}>
                    {stat.label}
                  </dt>
                  <dd
                    className={`whitespace-nowrap font-sans text-2xl font-bold tracking-tight ${t.text}`}
                  >
                    {stat.value}
                  </dd>
                </Reveal>
              ))}
            </dl>
          ) : null}

          <Reveal delay={440}>
            <ProjectLink project={lead} className="group mt-8 inline-flex">
              <ActionLabel project={lead} tone={tone} />
            </ProjectLink>
          </Reveal>
        </div>
      </article>

      {/* ── The rest ─────────────────────────────────────────────────── */}
      {rest.length ? (
        <div className="mt-24 md:mt-36">
          <Reveal>
            <p className={`u-label mb-5 ${t.muted}`}>More work</p>
          </Reveal>
          <ul className={`border-t ${t.rule}`}>
            {rest.map((project, i) => (
              <li key={project.title} className={`border-b ${t.rule}`}>
                <Reveal delay={i * 80}>
                  <ProjectLink
                    project={project}
                    className="group grid grid-cols-4 items-center gap-x-5 gap-y-5 py-6 md:grid-cols-12 md:py-8"
                  >
                    {project.image ? (
                      <div className="col-span-2 md:col-span-3">
                        <div className={`p-2 md:p-3 ${t.mat}`}>
                          <div className={`overflow-hidden border bg-paper ${t.matEdge}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={project.image}
                              alt=""
                              width={SHOT.width}
                              height={SHOT.height}
                              loading="lazy"
                              decoding="async"
                              className="block aspect-[16/10] h-auto w-full object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="col-span-2 md:col-span-3">
                      <p className={`u-label ${t.muted}`}>{project.role}</p>
                      <h3
                        className={`mt-2 font-sans text-[clamp(1.75rem,3.2vw,3rem)] font-bold leading-[0.95] tracking-tightest ${t.text}`}
                      >
                        {project.title}
                      </h3>
                    </div>

                    <p
                      className={`col-span-4 max-w-md text-base leading-relaxed md:col-span-4 ${t.body}`}
                    >
                      {project.description}
                    </p>

                    <div className="col-span-4 md:col-span-2 md:justify-self-end">
                      <ActionLabel project={project} tone={tone} />
                    </div>
                  </ProjectLink>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
