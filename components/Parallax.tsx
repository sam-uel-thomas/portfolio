"use client";

import { useEffect, useRef } from "react";

type ParallaxProps = {
  children: React.ReactNode;
  /** Drift factor. 0.2 ≈ subtle. Positive moves slower than scroll. */
  speed?: number;
  className?: string;
};

/**
 * Subtle parallax: translates children on the Y axis as the page scrolls,
 * driven by requestAnimationFrame so it stays smooth and cheap.
 * No-ops when the user prefers reduced motion.
 */
export default function Parallax({
  children,
  speed = 0.2,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = window.scrollY * speed;
      node.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
