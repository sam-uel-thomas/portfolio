/** The one easing curve the whole site moves on. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

/** True when the visitor has asked for less movement. Safe pre-mount. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Coarse pointers (touch) get no cursor effects and no hover-only affordances. */
export function hasFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

/** Frame-rate independent damping, so motion feels the same on 60 and 120Hz. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export type SpringAxis = { value: number; velocity: number };

/**
 * Spring defaults. `damping` is 0.55 of critical for this stiffness, which puts
 * a single ~12% overshoot on the return — a released element swings about 1.4px
 * past centre on a 12px lean, peaks at 0.27s and is still by 0.73s. One bounce,
 * not a wobble.
 *
 * Critical damping for stiffness k is 2·√k. Retune the stiffness and the
 * damping has to scale with it or the bounce changes as a side effect; raise
 * the damping toward 2·√k for less overshoot, lower it for more.
 */
export const SPRING_STIFFNESS = 200;
export const SPRING_DAMPING = 15.6;

/**
 * One frame of a damped spring, unlike `damp` in that it carries velocity — so
 * it overshoots and settles back rather than easing flatly into the target.
 *
 * Integrated at a fixed 1/240s substep: plain Euler at the raw frame time gives
 * a different bounce on 60 and 120Hz, and goes unstable outright if a dropped
 * frame makes dt large. Mutates `axis` — this runs per-axis per-frame and has
 * no business allocating.
 */
export function stepSpring(
  axis: SpringAxis,
  target: number,
  dt: number,
  stiffness = SPRING_STIFFNESS,
  damping = SPRING_DAMPING,
) {
  const substep = 1 / 240;
  let remaining = dt;

  while (remaining > 0) {
    const h = Math.min(substep, remaining);
    const acceleration =
      (target - axis.value) * stiffness - axis.velocity * damping;
    axis.velocity += acceleration * h;
    axis.value += axis.velocity * h;
    remaining -= h;
  }
}
