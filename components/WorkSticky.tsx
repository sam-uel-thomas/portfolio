"use client";

import { useEffect, useRef, useState } from "react";
import CaseFigure from "@/components/CaseFigure";
import { TransitionLink } from "@/components/PageTransition";
import type { CaseImage, Project } from "@/content/site";

/**
 * The work as a scrolling showcase. On wide screens the left column holds
 * still while each project's screenshots scroll past on the right, and the
 * left side changes to whichever project is passing.
 *
 * A project with a case study shows its cover and feature images, so the
 * deeper work gets the longer run. On phones there's nothing to pin against,
 * so each project's text simply sits above its images.
 */

/** The work screenshots are all captured at this size; it sets the frame's shape. */
const SHOT = { width: 2858, height: 1800 };

function galleryFor(project: Project): CaseImage[] {
  const study = project.caseStudy;
  if (study) return [study.cover, ...study.features.map((feature) => feature.image)];
  return project.image
    ? [{ src: project.image, alt: "", width: SHOT.width, height: SHOT.height }]
    : [];
}

function actionFor(project: Project) {
  if (project.caseStudy) return { label: "Read the case study", glyph: "→" };
  if (project.href.startsWith("http")) return { label: "Visit the site", glyph: "↗" };
  return null;
}

function ProjectLink({
  project,
  className,
  tabIndex,
  children,
}: {
  project: Project;
  className?: string;
  tabIndex?: number;
  children: React.ReactNode;
}) {
  if (project.caseStudy) {
    return (
      <TransitionLink
        href={`/work/${project.caseStudy.slug}`}
        label={project.title}
        className={className}
        tabIndex={tabIndex}
      >
        {children}
      </TransitionLink>
    );
  }
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      tabIndex={tabIndex}
    >
      {children}
    </a>
  );
}

/** One project's words. Shared by the pinned panel and the phone layout. */
function Details({ project, tabIndex }: { project: Project; tabIndex?: number }) {
  const action = actionFor(project);
  return (
    <>
      <p className="u-label">{project.role}</p>
      <h3 className="mt-4 font-sans text-[clamp(2.75rem,5.5vw,5.5rem)] font-bold leading-[0.9] tracking-tightest text-ink">
        {project.title}
      </h3>
      <p className="mt-6 max-w-md text-base leading-relaxed text-ink/75">{project.description}</p>
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
          tabIndex={tabIndex}
          className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink"
        >
          <span className="u-underline">{action.label}</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-editorial group-hover:translate-x-1"
          >
            {action.glyph}
          </span>
        </ProjectLink>
      ) : null}
    </>
  );
}

export default function WorkSticky({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Whichever project's images cross the middle of the screen is the one the
  // panel shows. A thin band at the centre, so exactly one group is in it.
  useEffect(() => {
    const groups = groupRefs.current.filter((g): g is HTMLDivElement => g !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = groups.indexOf(entry.target as HTMLDivElement);
          if (index >= 0) setActive(index);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    groups.forEach((group) => observer.observe(group));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-4 md:grid-cols-12 md:gap-x-5">
      {/* ── The pinned panel (wide screens) ─────────────────────────────
          Every project's details are stacked in one grid cell and the
          active one fades up, so the panel never changes height. Only the
          active one can be reached by keyboard or read out. */}
      <div className="hidden md:col-span-4 md:block">
        <div className="sticky top-28">
          {/* Where you are in the run: the names, the current one lit. */}
          <ul className="mb-10 flex flex-wrap gap-x-5 gap-y-1 border-t border-ink/15 pt-4">
            {projects.map((project, i) => (
              <li
                key={project.title}
                className={`text-sm font-medium transition-colors duration-500 ease-editorial ${
                  i === active ? "text-ink" : "text-ink/30"
                }`}
              >
                {project.title}
              </li>
            ))}
          </ul>

          <div className="grid">
            {projects.map((project, i) => {
              const lit = i === active;
              return (
                <div
                  key={project.title}
                  aria-hidden={!lit}
                  className={`[grid-area:1/1] transition-[opacity,transform] duration-500 ease-editorial ${
                    lit ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: lit ? "120ms" : "0ms" }}
                >
                  <Details project={project} tabIndex={lit ? undefined : -1} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── The scrolling images ───────────────────────────────────────── */}
      <div className="col-span-4 space-y-24 md:col-span-7 md:col-start-6 md:space-y-40">
        {projects.map((project, i) => (
          <div
            key={project.title}
            ref={(node) => {
              groupRefs.current[i] = node;
            }}
          >
            {/* Phones: the words go with their pictures. */}
            <div className="mb-8 md:hidden">
              <Details project={project} />
            </div>

            <ProjectLink project={project} tabIndex={-1} className="group block space-y-6 md:space-y-10">
              {galleryFor(project).map((image) => (
                <div
                  key={image.src}
                  className="transition-transform duration-700 ease-editorial group-hover:scale-[1.008]"
                >
                  <CaseFigure image={{ ...image, alt: "" }} />
                </div>
              ))}
            </ProjectLink>
          </div>
        ))}
      </div>
    </div>
  );
}
