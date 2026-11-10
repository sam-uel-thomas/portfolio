import CaseFigure from "@/components/CaseFigure";
import { TransitionLink } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import type { Project } from "@/content/site";

/**
 * The work, shown rather than listed: each project is a large screenshot on
 * one side and its story on the other, swapping sides down the page — the
 * same zigzag the case study uses, so the two read as one site.
 *
 * Projects with a case study open it, behind the page transition; the rest
 * go straight to the live site. One without either is shown, unlinked.
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

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-24 md:space-y-40">
      {projects.map((project, i) => {
        const flipped = i % 2 === 1;
        const action = project.caseStudy
          ? "Read the case study"
          : project.href.startsWith("http")
            ? "Visit the site"
            : null;

        return (
          <article
            key={project.title}
            className="grid grid-cols-4 items-end gap-y-8 md:grid-cols-12 md:gap-x-5"
          >
            {/* The image is the biggest target on the page, so it's a link
                too. Hover leans in slightly, as the work index's rows did. */}
            {project.image ? (
              <ProjectLink
                project={project}
                className={`group col-span-4 block md:col-span-7 ${
                  flipped ? "md:order-2 md:col-start-6" : ""
                }`}
              >
                <span className="sr-only">{project.title}</span>
                <div className="transition-transform duration-700 ease-editorial group-hover:scale-[1.015]">
                  <CaseFigure
                    image={{
                      src: project.image,
                      alt: "",
                      width: SHOT.width,
                      height: SHOT.height,
                    }}
                  />
                </div>
              </ProjectLink>
            ) : null}

            <div
              className={`col-span-4 md:col-span-4 ${
                flipped ? "md:order-1 md:col-start-1" : "md:col-start-9"
              }`}
            >
              <Reveal>
                <p className="u-label border-t border-ink/15 pt-4">{project.role}</p>
              </Reveal>
              <TextReveal
                as="h3"
                text={project.title}
                stagger={55}
                className="mt-5 block font-sans text-[clamp(2.5rem,5vw,4.75rem)] font-bold leading-[0.9] tracking-tightest text-ink"
              />
              <Reveal delay={120}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-ink/75">
                  {project.description}
                </p>
                {project.tags?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                    {project.tags.map((tag) => (
                      <li key={tag} className="text-xs font-medium text-ink/40">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {action ? (
                  <ProjectLink
                    project={project}
                    className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink"
                  >
                    <span className="u-underline">{action}</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 ease-editorial group-hover:translate-x-1"
                    >
                      {project.caseStudy ? "→" : "↗"}
                    </span>
                  </ProjectLink>
                ) : null}
              </Reveal>
            </div>
          </article>
        );
      })}
    </div>
  );
}
