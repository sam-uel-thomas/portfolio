"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { lockScroll, unlockScroll } from "@/lib/lenis";

/** Total time the counter takes to reach 100. Kept short — this is a beat, not a wait. */
const COUNT_MS = 1400;
/** How long the panel takes to clear the screen afterwards. */
const EXIT_MS = 900;

/**
 * The opening beat: a count to 100 against the wordmark, then the panel lifts
 * away to hand over to the hero.
 *
 * It counts real time rather than faking load progress — the page is static and
 * already there, so pretending to load it would be theatre. Any click or key
 * cuts straight to the end.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  // Guards against the skip handler and the natural finish both firing.
  const finished = useRef(false);

  useEffect(() => {
    lockScroll();

    let frame = 0;
    let exitTimer: ReturnType<typeof setTimeout>;
    const startedAt = performance.now();

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      cancelAnimationFrame(frame);
      setCount(100);
      setExiting(true);
      exitTimer = setTimeout(() => {
        unlockScroll();
        onDone();
      }, EXIT_MS);
    };

    const tick = (now: number) => {
      const t = Math.min((now - startedAt) / COUNT_MS, 1);
      // easeOutQuart: sprints early, settles into 100 rather than slamming into it.
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    frame = requestAnimationFrame(tick);

    window.addEventListener("pointerdown", finish);
    window.addEventListener("keydown", finish);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
      // Never leave the page locked if this unmounts mid-flight.
      unlockScroll();
    };
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col justify-between bg-paper px-5 py-6 transition-transform ease-editorial sm:px-8 lg:px-12"
      style={{
        transitionDuration: `${EXIT_MS}ms`,
        transform: exiting ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      {/* Top rule — the wordmark, matching the header's resting position. */}
      <div
        className="flex items-baseline justify-between transition-opacity duration-300"
        style={{ opacity: exiting ? 0 : 1 }}
      >
        <span className="font-sans text-lg font-bold tracking-tight text-ink">
          {site.name}
        </span>
        <span className="u-label">{site.location}</span>
      </div>

      {/* The counter, bottom-aligned against a rule that fills as it climbs. */}
      <div
        className="transition-opacity duration-300"
        style={{ opacity: exiting ? 0 : 1 }}
      >
        <div className="relative mb-5 h-px w-full bg-ink/15">
          <span
            className="absolute inset-y-0 left-0 bg-ink"
            style={{ width: `${count}%` }}
          />
        </div>
        <div className="flex items-end justify-between">
          <span className="u-label pb-2">{site.role}</span>
          <span className="font-sans text-[clamp(4rem,16vw,13rem)] font-bold leading-[0.8] tracking-tightest text-ink tabular-nums">
            {String(count).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
