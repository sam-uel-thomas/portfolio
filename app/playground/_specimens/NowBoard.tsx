"use client";

import { useEffect, useRef, useState } from "react";
import LocalTime from "@/components/LocalTime";
import { prefersReducedMotion } from "@/lib/motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Text that clatters into place like a departures board: every character
 * cycles through random glyphs and settles left to right. Bumping `play`
 * runs it again.
 */
function Scramble({ text, play }: { text: string; play: number }) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (play === 0 || prefersReducedMotion()) {
      setShown(text);
      return;
    }

    const chars = Array.from(text);
    // Each character settles a beat after the one before it, with a little
    // jitter so the edge looks mechanical rather than perfectly even.
    const settleAt = chars.map((_, i) => 140 + i * 26 + Math.random() * 90);
    const started = performance.now();
    let frame = 0;
    let lastSwap = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      // Swap glyphs at ~25fps — a board flips, it doesn't blur.
      if (now - lastSwap > 40) {
        lastSwap = now;
        setShown(
          chars
            .map((char, i) =>
              char === " " || elapsed >= settleAt[i]
                ? char
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
      }
      if (elapsed < settleAt[settleAt.length - 1]) {
        frame = requestAnimationFrame(tick);
      } else {
        setShown(text);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, play]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </>
  );
}

export type NowRow = {
  label: string;
  /** Leave empty to show `placeholder` as a muted prompt instead. */
  value: string;
  placeholder?: string;
};

/**
 * A short "now" list — what's on the go at the moment. Rows clatter in when
 * the board scrolls into view, and again on hover.
 */
export default function NowBoard({
  rows,
  available,
  availabilityLabel,
}: {
  rows: NowRow[];
  available: boolean;
  availabilityLabel: string;
}) {
  const ref = useRef<HTMLDListElement>(null);
  // One play counter per row; incrementing a row's counter replays it.
  const [plays, setPlays] = useState(() => rows.map(() => 0));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setPlays((all) => all.map((n) => n + 1));
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const replay = (index: number) =>
    setPlays((all) => all.map((n, i) => (i === index ? n + 1 : n)));

  const rowClass =
    "grid grid-cols-4 items-baseline gap-x-5 gap-y-1 border-b border-ink/15 py-5 md:grid-cols-12 md:py-6";
  const valueClass =
    "col-span-4 font-sans text-[clamp(1.35rem,2.6vw,2.25rem)] font-medium leading-tight tracking-tight md:col-span-9";

  return (
    <dl ref={ref} className="border-t border-ink/15">
      {rows.map((row, i) => (
        <div key={row.label} className={rowClass} onPointerEnter={() => replay(i)}>
          <dt className="u-label col-span-4 md:col-span-3">{row.label}</dt>
          <dd className={`${valueClass} ${row.value ? "text-ink" : "text-ink/25"}`}>
            <Scramble text={row.value || `[${row.placeholder ?? "To fill in"}]`} play={plays[i]} />
          </dd>
        </div>
      ))}

      {/* The two live rows: availability and the clock. */}
      <div className={rowClass}>
        <dt className="u-label col-span-4 md:col-span-3">Status</dt>
        <dd className={`${valueClass} flex items-center gap-3 text-ink`}>
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {available ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            ) : null}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                available ? "bg-accent" : "bg-ink/30"
              }`}
            />
          </span>
          {available ? availabilityLabel : "Booked up for now"}
        </dd>
      </div>
      <div className={rowClass}>
        <dt className="u-label col-span-4 md:col-span-3">Local time</dt>
        <dd className={`${valueClass} text-ink`}>
          <LocalTime />
        </dd>
      </div>
    </dl>
  );
}
