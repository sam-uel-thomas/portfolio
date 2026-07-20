"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { Project } from "@/content/site";

/**
 * The work index. On desktop, hovering a row reveals a preview image that
 * follows the cursor. On touch / mobile there's no hover, so each row simply
 * shows its preview inline.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = (e: React.MouseEvent) => {
    const node = previewRef.current;
    if (!node) return;
    const { clientX, clientY } = e;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      node.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    });
  };

  return (
    <div onMouseMove={handleMove} className="relative">
      {/* Index column headers (desktop) */}
      <div className="hidden grid-cols-12 gap-x-5 border-b border-ink/15 pb-3 md:grid">
        <span className="u-label col-span-7">Project</span>
        <span className="u-label col-span-4">Role</span>
        <span className="u-label col-span-1 text-right">↗</span>
      </div>

      {projects.map((project, i) => {
        const isLink = project.href.startsWith("http");
        return (
          <Reveal key={project.title} delay={i * 70}>
            <a
              href={project.href}
              {...(isLink
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="group block border-b border-line transition-colors duration-500 ease-editorial hover:bg-ink/[0.015]"
            >
              <div className="grid grid-cols-4 gap-y-5 py-8 md:grid-cols-12 md:items-baseline md:gap-x-5 md:py-11">
                <div className="col-span-4 md:col-span-7">
                  <h3 className="flex items-baseline gap-3 font-sans text-3xl font-medium tracking-tight text-ink transition-transform duration-500 ease-editorial group-hover:translate-x-2 md:text-[2.75rem] md:leading-none">
                    {project.title}
                    <span aria-hidden="true" className="text-base text-ink/50 md:hidden">
                      ↗
                    </span>
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                </div>

                <div className="col-span-4 self-start md:col-span-4 md:pt-2">
                  <span className="u-label inline-flex items-center border border-ink/20 px-3 py-1 text-ink/70">
                    {project.role}
                  </span>
                </div>

                {/* Inline preview — mobile only */}
                <div className="col-span-4 md:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    loading="lazy"
                    className="aspect-[16/10] w-full border border-line object-cover"
                  />
                </div>

                <span
                  aria-hidden="true"
                  className="hidden text-right text-xl text-ink opacity-60 transition-all duration-500 ease-editorial group-hover:translate-x-1 group-hover:opacity-100 md:col-span-1 md:block md:pt-2"
                >
                  ↗
                </span>
              </div>
            </a>
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
          className={`relative h-[15rem] w-[23rem] origin-left -translate-y-1/2 translate-x-8 overflow-hidden border border-ink/15 bg-canvas shadow-[0_24px_70px_-24px_rgba(0,0,0,0.3)] transition-[opacity,transform] duration-500 ease-editorial ${
            active !== null ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <AnimatePresence initial={false}>
            {active !== null ? (
              <motion.img
                key={active}
                src={projects[active].image}
                alt=""
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                exit={{ y: "-105%" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
