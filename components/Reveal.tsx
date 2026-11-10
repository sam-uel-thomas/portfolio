"use client";

import { useEffect, useRef, useState } from "react";
import { useIntroStart } from "@/components/Intro";

type RevealProps = {
  children: React.ReactNode;
  /** Delay the reveal (ms) to stagger sequential blocks. */
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  /**
   * "view"  — reveal when scrolled into view (default).
   * "intro" — reveal once the intro sequence has finished. Use for anything
   *           above the fold: the observer deliberately ignores the bottom
   *           slice of the viewport, so first-screen content sitting near the
   *           fold would otherwise wait for a scroll that may never come.
   */
  start?: "view" | "intro";
};

/**
 * Fades + lifts its children into view once, when they enter the viewport.
 * Uses a single IntersectionObserver per instance — no animation library.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  start = "view",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const introReady = useIntroStart();

  useEffect(() => {
    if (start !== "view") return;
    const node = ref.current;
    if (!node) return;

    // If reduced motion is requested, show immediately and skip observation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [start]);

  const Component = Tag as React.ElementType;
  const isVisible = start === "intro" ? introReady : visible;

  return (
    <Component
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
