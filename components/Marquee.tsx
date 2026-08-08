"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useScrollVelocity } from "@/lib/useScrollVelocity";

/**
 * A ticker that drifts on its own and reacts to scrolling — it accelerates as
 * you scroll down and runs backwards when you scroll up, which quietly ties
 * the strip to the page rather than leaving it looping in its own world.
 *
 * The row is duplicated as many times as it takes to cover the viewport plus
 * one full copy, so the wrap point is always off-screen.
 */
export default function Marquee({
  items,
  speed = 0.6,
}: {
  items: string[];
  /** Idle drift in pixels per frame. */
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [repeats, setRepeats] = useState(2);
  const velocity = useScrollVelocity();

  // Work out how many copies it takes to cover the screen plus one spare.
  useEffect(() => {
    const measure = () => {
      const width = groupRef.current?.offsetWidth ?? 0;
      if (!width) return;
      setRepeats(Math.ceil(window.innerWidth / width) + 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const track = trackRef.current;
    if (!track) return;

    let offset = 0;
    let frame = 0;

    const tick = () => {
      const groupWidth = groupRef.current?.offsetWidth ?? 0;
      if (groupWidth) {
        offset -= speed + velocity.current * 0.55;
        // Wrap within one group's width so the offset never grows unbounded
        // and the seam always lands off-screen.
        offset = ((offset % groupWidth) + groupWidth) % groupWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [speed, velocity]);

  const group = (ref?: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap px-6 font-sans text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium tracking-tight">
            {item}
          </span>
          <span className="text-[0.7em] opacity-30">✳</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      // Decoration assembled from copy that already appears elsewhere on the
      // page — announcing every duplicate would only add noise.
      aria-hidden="true"
      className="relative flex select-none overflow-hidden border-y border-ink/15 py-6"
    >
      <div ref={trackRef} className="marquee-track">
        {group(groupRef)}
        {Array.from({ length: Math.max(repeats - 1, 1) }).map((_, i) => (
          <Fragment key={i}>{group()}</Fragment>
        ))}
      </div>
    </div>
  );
}
