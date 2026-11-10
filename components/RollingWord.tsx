"use client";

import { useEffect, useRef, useState } from "react";
import { useIntroReady } from "@/components/Intro";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A sentence whose last word rolls through a list. Each word rises out of the
 * same kind of mask as the site's type reveals, and the slot resizes to fit
 * the incoming word so the full stop travels with it instead of jumping.
 */
export default function RollingWord({
  lead,
  words,
  interval = 2400,
  stackOnMobile = false,
  onIndexChange,
  className = "",
}: {
  lead: string;
  words: string[];
  interval?: number;
  /**
   * Put the rolling word on its own line below `sm`. Without it, a phone
   * column fits some words beside the lead and not others, so the line count
   * flips as it cycles and everything under it jumps.
   */
  stackOnMobile?: boolean;
  /** Told which word is showing, so something else can keep step with it. */
  onIndexChange?: (index: number) => void;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);
  const [widths, setWidths] = useState<number[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const slotRef = useRef<HTMLSpanElement>(null);
  // In the hero this sits under the intro overlay; rolling behind it would
  // waste the first word or two on nobody.
  const introReady = useIntroReady();

  // Measure every word up front. They're all mounted (absolutely positioned),
  // so this is one read per word rather than a measure on every swap.
  useEffect(() => {
    const measure = () => setWidths(wordRefs.current.map((node) => node?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [words]);

  // Cycle only while on screen — nobody needs it ticking in the background.
  useEffect(() => {
    if (!introReady || prefersReducedMotion()) return;
    const slot = slotRef.current;
    if (!slot) return;

    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) {
        timer = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
      }
    });
    observer.observe(slot);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [words.length, interval, introReady]);

  const prev = (index - 1 + words.length) % words.length;
  const width = widths[index];
  const list = `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;

  return (
    <p className={className}>
      <span className="sr-only">
        {lead} {list}.
      </span>
      <span aria-hidden="true">
        {lead}
        {stackOnMobile ? <br className="sm:hidden" /> : null}{" "}
        <span
          ref={slotRef}
          className="relative inline-block overflow-hidden whitespace-nowrap pb-[0.16em] pr-[0.08em] align-bottom transition-[width] duration-700 ease-editorial -mb-[0.16em] -mr-[0.08em]"
          style={width ? { width: `calc(${width}px + 0.08em)` } : undefined}
        >
          {/* Holds the line height; the visible words are layered over it. */}
          <span className="u-accent invisible">{words[index]}</span>
          {words.map((word, i) => {
            const state = i === index ? "in" : i === prev ? "out" : "parked";
            return (
              <span
                key={word}
                ref={(node) => {
                  wordRefs.current[i] = node;
                }}
                className="u-accent absolute left-0 top-0 ease-editorial"
                style={{
                  transform: `translateY(${state === "in" ? "0%" : state === "out" ? "-110%" : "110%"})`,
                  // A word going from "out" back to "parked" would sweep down
                  // through the slot on its way — so that move is instant.
                  transition: state === "parked" ? "none" : "transform 700ms var(--ease-editorial)",
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
        .
      </span>
    </p>
  );
}
