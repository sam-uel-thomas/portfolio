"use client";

import { useEffect, useRef } from "react";
import { useFooterSpacer } from "@/components/FooterReveal";
import { useIntroStart } from "@/components/Intro";
import { prefersReducedMotion, stepSpring, type SpringAxis } from "@/lib/motion";

/**
 * Looser than the site's default spring — about 0.45 of critical, so a letter
 * overshoots by roughly a fifth and settles in one more small swing.
 */
const STIFFNESS = 220;
const DAMPING = 13.5;
/** Peak lift under the cursor, as a fraction of letter height. */
const LIFT = 0.22;
/** Width of the bump, in average letter widths. */
const SPREAD = 0.9;
/** Degrees of lean per letter-height-per-second of vertical speed. */
const LEAN = 0.25;

/**
 * The rise-in. A CSS transition rather than the spring, because the browser
 * runs transform transitions on the compositor: they stay smooth while the
 * main thread is busy, and the rise always lands at a busy moment — a page
 * arriving, or the footer being uncovered mid-scroll with the smooth scroller
 * and every scroll effect running. Driven from requestAnimationFrame, as it
 * used to be, it dropped frames at exactly those moments.
 *
 * The curve overshoots by a few percent, so the letters still land with a
 * small bounce, like the spring did.
 */
const RISE_MS = 900;
const RISE_STAGGER_MS = 45;
const RISE_EASE = "cubic-bezier(0.34, 1.32, 0.64, 1)";

/**
 * A wordmark with some give in it. Letters rise out of a mask when the row is
 * first seen, and lift in a wave that follows the cursor along the row,
 * swinging back down with a bounce once it's passed.
 *
 * Each letter is two nested boxes, one per motion: the outer one carries the
 * rise (CSS, above), the inner one the cursor spring (JavaScript, below), so
 * neither has to share a transform with the other.
 *
 * Every letter is a spring chasing a target, and the cursor only ever moves
 * the targets. An earlier version kicked each letter's velocity as the cursor
 * crossed it, which gave a letter several instant changes of direction per
 * pass (once for itself, again for each neighbour) — visible as stutter. A
 * moving target keeps every letter's velocity continuous, so it's fluid.
 *
 * Distances use each letter's outer layout box (offsetLeft/offsetWidth), which
 * transforms don't affect, so a lifted letter can't feed back into its own
 * target. Those boxes only move on resize, so they're measured then.
 */
export default function SpringyWordmark({
  text,
  typeClassName = "text-center font-sans text-[17cqw] font-bold leading-[0.8] tracking-tightest",
  waitForIntro = false,
}: {
  text: string;
  /**
   * Size, weight, alignment and colour of the letters. The default is the
   * footer's: centred, and sized to fill its container.
   */
  typeClassName?: string;
  /**
   * Hold the rise until the page is free to animate — for a title that's on
   * screen at load, which would otherwise rise behind the intro or a page
   * transition and be finished before anyone sees it.
   */
  waitForIntro?: boolean;
}) {
  const rowRef = useRef<HTMLSpanElement>(null);
  /** Outer boxes: the rise. */
  const riseRefs = useRef<(HTMLSpanElement | null)[]>([]);
  /** Inner boxes: the cursor spring. */
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letters = Array.from(text);
  const spacerRef = useFooterSpacer();

  // Read inside the effect through refs, so readiness arriving doesn't tear
  // down the springs and start them again.
  const introStarted = useIntroStart();
  const readyRef = useRef(!waitForIntro || introStarted);
  readyRef.current = !waitForIntro || introStarted;
  const kickRef = useRef<() => void>(() => {});
  useEffect(() => {
    if (introStarted) kickRef.current();
  }, [introStarted]);

  useEffect(() => {
    const row = rowRef.current;
    const nodes = letterRefs.current.filter((n): n is HTMLSpanElement => n !== null);
    const risers = riseRefs.current.filter((n): n is HTMLSpanElement => n !== null);
    if (!row || nodes.length === 0) return;

    if (prefersReducedMotion()) {
      risers.forEach((node) => (node.style.transform = "none"));
      return;
    }

    const isSpace = Array.from(text).map((char) => char === " ");
    let height = 0;
    let centres: number[] = [];
    let sigma = 1;
    // Positions come from the outer (rise) boxes. The inner boxes' offsetLeft
    // is measured from their own outer box, not the row: Chrome treats a
    // `will-change: transform` element as an offsetParent, so every letter
    // would report itself as sitting near zero and the wave would spread
    // evenly along the row instead of following the cursor.
    const measure = () => {
      height = nodes[0].offsetHeight;
      centres = risers.map((node) => node.offsetLeft + node.offsetWidth / 2);
      const total = risers.reduce((sum, node) => sum + node.offsetWidth, 0);
      sigma = (total / risers.length) * SPREAD;
    };
    measure();

    const springs: SpringAxis[] = nodes.map(() => ({ value: 0, velocity: 0 }));
    /** Pointer x within the row, or null when it's elsewhere. */
    let pointer: number | null = null;

    const targetFor = (i: number) => {
      if (pointer === null || isSpace[i]) return 0;
      const d = (pointer - centres[i]) / sigma;
      return -LIFT * height * Math.exp(-d * d);
    };

    const write = (node: HTMLSpanElement, spring: SpringAxis) => {
      const lean = (spring.velocity / height) * LEAN;
      node.style.transform = `translate3d(0, ${spring.value}px, 0) rotate(${lean}deg)`;
    };

    let frame = 0;
    let last = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      let settled = true;

      nodes.forEach((node, i) => {
        const spring = springs[i];
        const target = targetFor(i);
        stepSpring(spring, target, dt, STIFFNESS, DAMPING);
        if (Math.abs(spring.value - target) > 0.1 || Math.abs(spring.velocity) > 1) {
          settled = false;
        } else {
          spring.value = target;
          spring.velocity = 0;
        }
        write(node, spring);
      });

      if (settled) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const track = (event: PointerEvent) => {
      pointer = event.clientX - row.getBoundingClientRect().left;
      wake();
    };
    const release = () => {
      pointer = null;
      wake();
    };
    // Touch has no hover: the wave follows a finger while it's down.
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") release();
    };

    const resize = new ResizeObserver(() => {
      measure();
      wake();
    });
    resize.observe(row);

    // Rise in, staggered, the first time the row is actually seen. Only the
    // transition is set here; the browser animates it from there.
    let started = false;
    let waiting = false;
    const rise = () => {
      if (started) return;
      // Seen, but the page isn't ready to animate yet: rise when it is.
      if (!readyRef.current) {
        waiting = true;
        return;
      }
      started = true;
      risers.forEach((node, i) => {
        node.style.transition = `transform ${RISE_MS}ms ${RISE_EASE} ${i * RISE_STAGGER_MS}ms`;
        node.style.transform = "translate3d(0, 0, 0)";
      });
    };

    kickRef.current = () => {
      if (waiting) {
        waiting = false;
        rise();
      }
    };

    // Inside the fixed footer, "seen" means uncovered. It starts once the
    // bottom quarter of the row is showing, so the letters are already on
    // their way up as the rest comes into view; waiting for half the row, as
    // it used to, left an empty band on screen first, which read as lag.
    // Elsewhere, plain visibility.
    const spacer = spacerRef?.current;
    let observer: IntersectionObserver | null = null;
    const onScroll = () => {
      if (!spacer) return;
      const rowRect = row.getBoundingClientRect();
      if (spacer.getBoundingClientRect().top <= rowRect.top + rowRect.height * 0.75) {
        window.removeEventListener("scroll", onScroll);
        rise();
      }
    };

    if (spacer) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          rise();
        },
        { threshold: 0.2 },
      );
      observer.observe(row);
    }
    row.addEventListener("pointermove", track);
    row.addEventListener("pointerdown", track);
    row.addEventListener("pointerup", onUp);
    row.addEventListener("pointercancel", release);
    row.addEventListener("pointerleave", release);

    return () => {
      observer?.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      row.removeEventListener("pointermove", track);
      row.removeEventListener("pointerdown", track);
      row.removeEventListener("pointerup", onUp);
      row.removeEventListener("pointercancel", release);
      row.removeEventListener("pointerleave", release);
    };
  }, [text, spacerRef]);

  return (
    <span className="block [container-type:inline-size]">
      <span className="sr-only">{text}</span>
      {/* The mask. `relative` makes it the letters' offsetParent, which the
          distance maths relies on. Top padding is headroom for the rise's
          overshoot and the lift; bottom padding lets a letter swing a little
          below its baseline on the way back down without having its round
          bottom sliced off — the line box ends only ~0.03em under the
          baseline at this leading. The negative margin hands that bottom
          room back to the layout. */}
      <span
        ref={rowRef}
        aria-hidden="true"
        className={`relative -mb-[0.12em] block select-none overflow-hidden whitespace-nowrap pb-[0.12em] pt-[0.3em] ${typeClassName}`}
      >
        {letters.map((letter, i) => (
          // Parked 130% down, past the padding under the baseline, which
          // would otherwise show the tops of waiting letters.
          <span
            key={i}
            ref={(node) => {
              riseRefs.current[i] = node;
            }}
            className="inline-block [.js_&]:translate-y-[130%]"
            style={{ willChange: "transform" }}
          >
            <span
              ref={(node) => {
                letterRefs.current[i] = node;
              }}
              className="inline-block origin-bottom"
              style={{ willChange: "transform" }}
            >
              {letter === " " ? " " : letter}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
