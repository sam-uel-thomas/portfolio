import type Lenis from "lenis";

/**
 * Module-level handle on the single Lenis instance.
 *
 * SmoothScroll owns the lifecycle and writes here; anything that needs to
 * pause scrolling (the intro overlay) reads it. A plain object beats context
 * for this — the consumers aren't in a shared subtree, and nothing needs to
 * re-render when the instance changes.
 */
export const lenisRef: { current: Lenis | null } = { current: null };

/** Freeze scrolling, with a fallback for when Lenis is off (reduced motion). */
export function lockScroll() {
  lenisRef.current?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  lenisRef.current?.start();
  document.documentElement.style.overflow = "";
}
