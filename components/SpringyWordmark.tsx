"use client";

import { useEffect, useRef } from "react";
import { useFooterSpacer } from "@/components/FooterReveal";
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
 * Where letters wait before they rise, in letter heights below their resting
 * place. Past 1 because of the padding under the baseline, which would
 * otherwise show the tops of parked letters.
 */
const PARKED = 1.3;

/**
 * The footer wordmark, with some give in it. Letters spring up out of a mask
 * once the footer is uncovered, and lift in a wave that follows the cursor
 * along the row, swinging back down with a bounce once it's passed.
 *
 * Every letter is a spring chasing a target, and the cursor only ever moves
 * the targets. An earlier version kicked each letter's velocity as the cursor
 * crossed it, which gave a letter several instant changes of direction per
 * pass (once for itself, again for each neighbour) — visible as stutter. A
 * moving target keeps every letter's velocity continuous, so it's fluid.
 *
 * Distances use each letter's layout box (offsetLeft/offsetWidth), which
 * transforms don't affect, so a lifted letter can't feed back into its own
 * target. Those boxes only move on resize, so they're measured then.
 */
export default function SpringyWordmark({ text }: { text: string }) {
  const rowRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letters = Array.from(text);
  const spacerRef = useFooterSpacer();

  useEffect(() => {
    const row = rowRef.current;
    const nodes = letterRefs.current.filter((n): n is HTMLSpanElement => n !== null);
    if (!row || nodes.length === 0) return;

    if (prefersReducedMotion()) {
      nodes.forEach((node) => (node.style.transform = "none"));
      return;
    }

    const isSpace = Array.from(text).map((char) => char === " ");
    let height = 0;
    let centres: number[] = [];
    let sigma = 1;
    const measure = () => {
      height = nodes[0].offsetHeight;
      centres = nodes.map((node) => node.offsetLeft + node.offsetWidth / 2);
      const total = nodes.reduce((sum, node) => sum + node.offsetWidth, 0);
      sigma = (total / nodes.length) * SPREAD;
    };
    measure();

    const springs: SpringAxis[] = nodes.map(() => ({ value: height * PARKED, velocity: 0 }));
    const risen = nodes.map(() => false);
    /** Pointer x within the row, or null when it's elsewhere. */
    let pointer: number | null = null;

    const targetFor = (i: number) => {
      if (!risen[i]) return height * PARKED;
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

    // Rise in, staggered, the first time the row is actually seen.
    const timers: number[] = [];
    let started = false;
    const rise = () => {
      if (started) return;
      started = true;
      nodes.forEach((_, i) => {
        timers.push(
          window.setTimeout(() => {
            risen[i] = true;
            wake();
          }, i * 55),
        );
      });
    };

    // Inside the fixed footer, "seen" means uncovered: the page content has
    // scrolled up past the middle of the row. Elsewhere, plain visibility.
    const spacer = spacerRef?.current;
    let observer: IntersectionObserver | null = null;
    const onScroll = () => {
      if (!spacer) return;
      const rowRect = row.getBoundingClientRect();
      if (spacer.getBoundingClientRect().top <= rowRect.top + rowRect.height / 2) {
        window.removeEventListener("scroll", onScroll);
        rise();
      }
    };

    nodes.forEach((node, i) => write(node, springs[i]));
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
        { threshold: 0.4 },
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
      timers.forEach(window.clearTimeout);
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
        className="relative -mb-[0.12em] block select-none overflow-hidden whitespace-nowrap pb-[0.12em] pt-[0.3em] text-center font-sans text-[17cqw] font-bold leading-[0.8] tracking-tightest"
      >
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(node) => {
              letterRefs.current[i] = node;
            }}
            className="inline-block origin-bottom [.js_&]:translate-y-[130%]"
            style={{ willChange: "transform" }}
          >
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
    </span>
  );
}
