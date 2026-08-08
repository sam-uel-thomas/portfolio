"use client";

import { useEffect, useRef } from "react";

/**
 * Smoothed scroll velocity in pixels-per-frame, as a ref.
 *
 * Deliberately a ref rather than state: this updates every frame and its
 * consumers (the marquee, the preview skew) read it inside their own rAF
 * loops. Putting it in state would re-render the tree 60 times a second.
 */
export function useScrollVelocity() {
  const velocity = useRef(0);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const tick = () => {
      const now = window.scrollY;
      const delta = now - last;
      last = now;
      // Ease toward the raw delta so the value ramps up and decays instead of
      // snapping — and settles at 0 on its own once scrolling stops.
      velocity.current += (delta - velocity.current) * 0.18;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return velocity;
}
