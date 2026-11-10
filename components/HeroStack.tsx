"use client";

import { useEffect, useRef } from "react";
import { useIntroStart } from "@/components/Intro";
import { damp, hasFinePointer, prefersReducedMotion } from "@/lib/motion";

export type StackCard = { title: string; image: string };

/**
 * Where a card sits by how far back it is: 0 is the front. Offsets are
 * percentages of the card's own size, so the fan keeps its shape at any width.
 */
const SLOTS = [
  { x: 0, y: 0, rotate: -2, scale: 1 },
  { x: 9, y: -10, rotate: 4, scale: 0.94 },
  { x: -7, y: -19, rotate: -6, scale: 0.88 },
];
/** How far each slot drifts with the cursor, in pixels. Nearer moves more. */
const DRIFT = [20, 12, 6];

/**
 * A loose stack of project screenshots for the hero. Whichever card is
 * `active` comes to the front and the rest fan out behind it, so a caller can
 * shuffle the stack in step with something else — here, the rolling word.
 *
 * The whole stack leans a little toward the cursor, front card most, which is
 * enough depth to make flat screenshots read as objects.
 *
 * Two nested boxes per card, because two things move it: the outer one is
 * written every frame by the cursor drift, the inner one carries the slot and
 * transitions in CSS. Sharing one transform would have the drift fighting the
 * transition for it.
 */
export default function HeroStack({
  cards,
  active,
  className = "",
}: {
  cards: StackCard[];
  /** Index of the card to bring to the front. */
  active: number;
  className?: string;
}) {
  const driftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ready = useIntroStart();
  const count = cards.length;
  const slotOf = (i: number) => (i - active + count) % count;

  // The drift loop reads slots from a ref, so a shuffle doesn't restart it.
  const slots = useRef<number[]>([]);
  slots.current = cards.map((_, i) => slotOf(i));

  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let last = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      current.x = damp(current.x, target.x, 5, dt);
      current.y = damp(current.y, target.y, 5, dt);

      driftRefs.current.forEach((node, i) => {
        if (!node) return;
        const depth = DRIFT[Math.min(slots.current[i], DRIFT.length - 1)];
        node.style.transform = `translate3d(${current.x * depth}px, ${current.y * depth}px, 0)`;
      });

      if (Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      // -1 to 1 across the viewport, so the stack leans toward the cursor
      // wherever on the page it is.
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2;
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // Decorative: the same projects are listed, with links, in the work index
    // directly below.
    <div aria-hidden="true" className={`relative ${className}`.trim()}>
      {/* Room above the front card for the ones fanned out behind it. */}
      <div className="relative mt-[16%] aspect-[16/10] w-full">
        {cards.map((card, i) => {
          const slot = SLOTS[Math.min(slotOf(i), SLOTS.length - 1)];
          return (
            <div
              key={card.title}
              ref={(node) => {
                driftRefs.current[i] = node;
              }}
              className="absolute inset-0"
              style={{ zIndex: count - slotOf(i), willChange: "transform" }}
            >
              <div
                className={`h-full w-full overflow-hidden border border-ink/10 bg-canvas shadow-[0_30px_80px_-28px_rgba(0,0,0,0.4)] transition-[transform,opacity] duration-[900ms] ease-editorial ${
                  ready ? "" : "[.js_&]:opacity-0"
                }`}
                style={{
                  // Cards arrive from below in turn, back one first, then take
                  // their place in the fan.
                  transform: ready
                    ? `translate(${slot.x}%, ${slot.y}%) rotate(${slot.rotate}deg) scale(${slot.scale})`
                    : `translate(${slot.x}%, ${slot.y + 30}%) rotate(${slot.rotate * 2}deg) scale(${slot.scale})`,
                  transitionDelay: ready ? "0ms" : `${(count - slotOf(i)) * 110}ms`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt=""
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
