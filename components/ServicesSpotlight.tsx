"use client";

import { useState } from "react";
import type { Service } from "@/content/site";

/**
 * Services as a spotlight list. One row is always lit: it steps forward and
 * re-sets itself in the serif italic, wiping in from the left, while the
 * detail panel beside it swaps to match.
 *
 * Rows never change height. Expanding rows on hover shove everything below
 * them around, so the row under the cursor moves away and the next one opens
 * instead. The panel takes the detail out of the list, so the list stays put.
 */
export default function ServicesSpotlight({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-4 md:grid-cols-12 md:gap-x-5">
      <ul className="col-span-4 border-t border-ink/15 md:col-span-7">
        {services.map((service, i) => {
          const lit = i === active;
          return (
            <li key={service.title} className="border-b border-ink/15">
              <button
                type="button"
                aria-pressed={lit}
                aria-controls="service-detail"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group flex w-full items-baseline gap-5 py-5 text-left md:py-6"
              >
                {/* A marker rather than a number: it only has to say which
                    row is lit. */}
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 -translate-y-[0.6em] rounded-full transition-[background-color,transform] duration-500 ease-editorial ${
                    lit ? "scale-100 bg-accent" : "scale-50 bg-ink/20"
                  }`}
                />

                <span
                  className={`relative block font-sans text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.95] tracking-tightest transition-transform duration-700 ease-editorial ${
                    lit ? "md:translate-x-4" : ""
                  }`}
                >
                  {/* The grotesk, dimmed when not lit. */}
                  <span
                    className={`block font-bold transition-opacity duration-500 ease-editorial md:text-ink/15 ${
                      lit ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {service.title}
                  </span>
                  {/* The serif, laid over it and wiped in from the left. */}
                  <span
                    aria-hidden="true"
                    className="u-accent absolute inset-y-0 left-0 block whitespace-nowrap pr-[0.1em] text-ink transition-[clip-path] duration-700 ease-editorial"
                    style={{ clipPath: lit ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
                  >
                    {service.title}
                  </span>
                </span>
              </button>

              {/* Touch has no hover to drive the panel, so each row carries its
                  own summary instead. */}
              <div className="pb-6 pl-[3.25rem] md:hidden">
                <p className="text-base leading-relaxed text-ink/70">{service.summary}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden md:col-span-4 md:col-start-9 md:block">
        <div
          id="service-detail"
          aria-live="polite"
          className="sticky top-28 grid border-t border-ink/15 pt-5"
        >
          {/* All panels share one grid cell, so the box is always the height
              of the tallest and nothing below it moves when they swap. */}
          {services.map((service, i) => {
            const lit = i === active;
            return (
              <div
                key={service.title}
                aria-hidden={!lit}
                className={`[grid-area:1/1] transition-[opacity,transform] duration-500 ease-editorial ${
                  lit ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: lit ? "120ms" : "0ms" }}
              >
                <p className="u-label mb-6">{service.title}</p>
                <p className="text-xl font-medium leading-snug tracking-tight text-ink lg:text-2xl">
                  {service.summary}
                </p>
                <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-baseline gap-2 text-base text-ink">
                      <span className="text-xs text-ink/40">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
