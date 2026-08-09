"use client";

import { useEffect, useRef } from "react";
import { damp, hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type MagneticProps = {
  children: React.ReactNode;
  /** How far the element leans toward the pointer, as a fraction of the offset. */
  strength?: number;
  /** How far outside its own box the element starts reacting, in pixels. */
  padding?: number;
  className?: string;
};

/**
 * Leans its child toward the pointer when the pointer gets close, and springs
 * back when it leaves. Keep `strength` low — the effect should be felt more
 * than seen, and anything past ~0.4 starts to feel like the link is dodging
 * the click.
 */
export default function Magnetic({
  children,
  strength = 0.25,
  padding = 40,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let lastTime = performance.now();
    let idle = true;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      // The rect includes the transform we're applying, so back it out to get
      // the element's resting centre. Measuring the displaced centre makes the
      // element chase its own movement and settle short of `strength`.
      const cx = rect.left + rect.width / 2 - current.x;
      const cy = rect.top + rect.height / 2 - current.y;
      const withinX = Math.abs(event.clientX - cx) < rect.width / 2 + padding;
      const withinY = Math.abs(event.clientY - cy) < rect.height / 2 + padding;

      if (withinX && withinY) {
        target.x = (event.clientX - cx) * strength;
        target.y = (event.clientY - cy) * strength;
      } else {
        target.x = 0;
        target.y = 0;
      }

      // Only spin the loop back up when there's something to animate toward.
      if (idle && (target.x || target.y)) {
        idle = false;
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      current.x = damp(current.x, target.x, 10, dt);
      current.y = damp(current.y, target.y, 10, dt);
      node.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

      const settled =
        Math.abs(current.x - target.x) < 0.05 &&
        Math.abs(current.y - target.y) < 0.05 &&
        target.x === 0 &&
        target.y === 0;

      if (settled) {
        node.style.transform = "";
        idle = true;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [strength, padding]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
