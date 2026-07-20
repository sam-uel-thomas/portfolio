"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initialises Lenis smooth scrolling and routes in-page anchor links through it.
 * No-ops for visitors who prefer reduced motion (native scrolling stays).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Route hash links through Lenis for a smooth glide.
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const hash = target.getAttribute("href") ?? "";
      if (hash === "#" || hash === "#top") {
        event.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const el = document.querySelector(hash);
      if (el) {
        event.preventDefault();
        lenis.scrollTo(el as HTMLElement);
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
