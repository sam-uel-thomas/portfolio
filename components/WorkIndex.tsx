"use client";

import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import type { Project } from "@/content/site";
import { damp, prefersReducedMotion } from "@/lib/motion";

/**
 * Stand-in for a project without a screenshot. A typographic plate reads as a
 * deliberate choice where a broken image or a grey box reads as an oversight.
 */
function Plate({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-canvas p-6">
      <span className="u-label">{project.role}</span>
      <span className="font-sans text-4xl font-bold tracking-tightest text-ink">
        {project.title}
      </span>
    </div>
  );
}

/**
 * The work index.
 *
 * On desktop each row fills with ink on hover and a preview panel trails the
 * cursor, banking into the turns — the lag between the pointer and the panel
 * is what drives the rotation, so it leans in proportion to how fast you move.
 *
 * Touch devices have no hover, so every row simply shows its preview inline.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  // `prev` is what the outgoing panel needs in order to leave upward while the
  // incoming one arrives from below. Both live in one state object so a single
  // update can't leave them describing different moments.
  const [{ active, prev }, setHover] = useState<{
    active: number | null;
    prev: number | null;
  }>({ active: null, prev: null });
  const previewRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Whatever was showing becomes the panel that exits — including on the way
  // out, where `active` goes null and the last panel still has to leave.
  const setActive = (index: number | null) =>
    setHover((state) => ({ active: index, prev: state.active }));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const node = previewRef.current;
    if (!node) return;

    const pos = { x: 0, y: 0 };
    let rotation = 0;
    let frame = 0;
    let lastTime = performance.now();
    let seeded = false;

    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      // Drop the panel straight onto the cursor the first time rather than
      // flying it in from the top-left corner.
      if (!seeded) {
        pos.x = event.clientX;
        pos.y = event.clientY;
        seeded = true;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      pos.x = damp(pos.x, pointer.current.x, 11, dt);
      pos.y = damp(pos.y, pointer.current.y, 11, dt);

      // How far the panel is trailing the pointer *is* the velocity signal.
      const lag = pointer.current.x - pos.x;
      const targetRotation = Math.max(Math.min(lag * 0.16, 12), -12);
      rotation = damp(rotation, targetRotation, 8, dt);

      node.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${rotation}deg)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="relative">
      {/* Index column headers (desktop) */}
      <div className="hidden grid-cols-12 gap-x-5 border-b border-ink/15 pb-3 md:grid">
        <span className="u-label col-span-7 pl-3 lg:pl-4">Project</span>
        <span className="u-label col-span-4">Role</span>
        <span className="u-label col-span-1 text-right">↗</span>
      </div>

      {projects.map((project, i) => {
        // A project with a case study opens its own page, which carries the
        // link out to the live site. One without goes straight out. One with
        // neither is unreleased, and the row is just a row.
        const caseHref = project.caseStudy ? `/work/${project.caseStudy.slug}` : null;
        const isExternal = !caseHref && project.href.startsWith("http");
        const RowTag: React.ElementType = caseHref ? TransitionLink : isExternal ? "a" : "div";
        const glyph = caseHref ? "→" : isExternal ? "↗" : "◦";

        return (
          <Reveal key={project.title} delay={i * 70}>
            <RowTag
              {...(caseHref
                ? { href: caseHref, label: project.title }
                : isExternal
                  ? {
                      href: project.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {})}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="group relative block overflow-hidden border-b border-line"
            >
              {/* Ink wash, wiping up from the baseline. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-editorial group-hover:scale-y-100"
              />

              <div className="relative grid grid-cols-4 gap-y-5 py-8 md:grid-cols-12 md:items-baseline md:gap-x-5 md:py-11">
                {/* Indented off the container edge, so the title has room
                    inside the ink wash instead of sitting flush against it. */}
                <div className="col-span-4 md:col-span-7 md:pl-3 lg:pl-4">
                  <h3 className="flex items-baseline gap-3 font-sans text-3xl font-medium tracking-tight text-ink transition-[transform,color] duration-500 ease-editorial group-hover:translate-x-2 group-hover:text-paper md:text-[2.75rem] md:leading-none">
                    {project.title}
                    <span
                      aria-hidden="true"
                      className="text-base text-ink/50 transition-colors duration-500 group-hover:text-paper/50 md:hidden"
                    >
                      {glyph}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted transition-colors duration-500 ease-editorial group-hover:text-paper/60">
                    {project.description}
                  </p>
                </div>

                <div className="col-span-4 flex flex-wrap items-start gap-2 self-start md:col-span-4 md:pt-2">
                  <span className="u-label inline-flex items-center border border-ink/20 px-3 py-1 text-ink/70 transition-colors duration-500 ease-editorial group-hover:border-paper/30 group-hover:text-paper/80">
                    {project.role}
                  </span>
                  {project.status === "in-development" ? (
                    <span className="u-label inline-flex items-center gap-1.5 border border-accent/40 px-3 py-1 text-accent">
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      In development
                    </span>
                  ) : null}
                  {/* Metadata, not chips — tighter tracking and no border so a
                      long list reads as a caption rather than a second row of
                      buttons competing with the role. */}
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center py-1 text-xs font-medium text-ink/40 transition-colors duration-500 ease-editorial group-hover:text-paper/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Inline preview — mobile only */}
                <div className="col-span-4 md:hidden">
                  <div className="aspect-[16/10] w-full overflow-hidden border border-line">
                    {project.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Plate project={project} />
                    )}
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  /* Travels inward, mirroring the title's +2. The row clips at
                     `overflow-hidden` and the arrow already sits flush to that
                     edge, so any outward nudge takes it out of frame — and the
                     pair converging reads better than both sliding right. */
                  className="hidden text-right text-xl text-ink opacity-60 transition-[transform,color,opacity] duration-500 ease-editorial group-hover:-translate-x-2 group-hover:text-paper group-hover:opacity-100 md:col-span-1 md:block md:pt-2"
                >
                  {glyph}
                </span>
              </div>
            </RowTag>
          </Reveal>
        );
      })}

      {/* Cursor-following preview — desktop only */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`relative origin-left -translate-y-1/2 translate-x-10 transition-[opacity,transform] duration-500 ease-editorial ${
            active !== null ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <div className="relative h-[16rem] w-[25rem] overflow-hidden bg-canvas shadow-[0_30px_80px_-28px_rgba(0,0,0,0.45)]">
            {/* Every panel is mounted and parked below the frame; the active one
                slides up into it and the outgoing one continues out of the top,
                so the two always move as a pair. */}
            {projects.map((project, i) => (
              <div
                key={project.title}
                className="absolute inset-0 transition-transform duration-[550ms] ease-editorial"
                style={{
                  transform: `translateY(${
                    i === active ? "0%" : i === prev ? "-105%" : "105%"
                  })`,
                }}
              >
                {project.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Plate project={project} />
                )}
              </div>
            ))}
          </div>

          {/* The contrast disc, moved off the pointer and onto the panel it
              describes. Only for rows that actually go somewhere — an
              unreleased project has nothing to view. */}
          <span
            className={`absolute -left-6 -top-6 flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full bg-ink text-sm font-medium text-paper transition-[opacity,transform] duration-500 ease-editorial ${
              active !== null && (projects[active].caseStudy || projects[active].href)
                ? "scale-100 opacity-100"
                : "scale-75 opacity-0"
            }`}
          >
            {/* Holds its last word while it fades out, so it doesn't flick
                back to "View" on the way. */}
            {(active !== null ? projects[active] : prev !== null ? projects[prev] : null)
              ?.caseStudy
              ? "Read"
              : "View"}
          </span>
        </div>
      </div>
    </div>
  );
}
