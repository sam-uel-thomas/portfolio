/**
 * Procedural paint splats, in the same construction as app/icon.svg: a ring of
 * anchors joined as a closed Catmull-Rom curve. The thrown-looking runs come
 * from anchor pairs close in angle at high radius, with tucked neighbours
 * either side — evenly spaced anchors only ever undulate into a blob.
 *
 * Everything is in unit space (body radius ≈ 1) so a splat can be drawn at any
 * size from one viewBox.
 */

/** Room for the furthest spike plus its droplets. */
export const SPLAT_VIEWBOX = "-2.6 -2.6 5.2 5.2";

type Anchor = {
  angle: number;
  radius: number;
  /** Per-anchor wobble rate and offset, so the outline never breathes in sync. */
  speed: number;
  phase: number;
  spike: boolean;
};

type Droplet = {
  angle: number;
  distance: number;
  radius: number;
  speed: number;
  phase: number;
};

export type SplatShape = { anchors: Anchor[]; droplets: Droplet[] };

/** mulberry32 — tiny seeded PRNG, so a splat can be re-drawn from its seed. */
function seeded(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeSplat(seed: number): SplatShape {
  const rand = seeded(seed);
  const count = 11 + Math.floor(rand() * 4);

  // Two or three thrown runs, never on adjacent anchors — two spikes side by
  // side merge into one fat lobe and the shape reads as a blob again.
  //
  // Fisher–Yates rather than sort(() => rand() - 0.5): a random comparator's
  // result depends on the engine's sort internals, so Node and the browser
  // drew different shapes from the same seed and hydration failed.
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const spikes = new Set<number>();
  const wanted = 2 + Math.floor(rand() * 2);
  for (const i of order) {
    if (spikes.size === wanted) break;
    const clash = Array.from(spikes).some((s) => {
      const gap = Math.abs(s - i);
      return Math.min(gap, count - gap) < 2;
    });
    if (!clash) spikes.add(i);
  }

  const anchor = (angle: number, radius: number, spike: boolean): Anchor => ({
    angle,
    radius,
    spike,
    speed: 0.6 + rand() * 0.9,
    phase: rand() * Math.PI * 2,
  });

  const anchors: Anchor[] = [];
  const droplets: Droplet[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.35;

    // Tuned by eye in both directions: much past 1.7× with a needle tip and
    // it turns into a four-point sparkle; under ~1.35× with a broad tip and
    // the runs melt back into a plain blob.
    if (spikes.has(i)) {
      const reach = 1.38 + rand() * 0.32;
      const spread = 0.055 + rand() * 0.05;
      anchors.push(anchor(angle - spread, reach, true));
      anchors.push(anchor(angle + spread, reach * (0.9 + rand() * 0.1), true));

      // Most runs fling a droplet off their tip.
      if (rand() > 0.25) {
        droplets.push({
          angle: angle + (rand() - 0.5) * 0.4,
          distance: reach + 0.3 + rand() * 0.35,
          radius: 0.09 + rand() * 0.09,
          speed: 0.5 + rand() * 0.6,
          phase: rand() * Math.PI * 2,
        });
      }
    } else {
      // Lumpy rather than round: most anchors vary a little, a few bulge.
      const lobe = rand() > 0.8 ? 1.12 : 1;
      anchors.push(anchor(angle, (0.86 + rand() * 0.22) * lobe, false));
    }
  }

  // Tuck the body in either side of each run so it tapers instead of bulging.
  anchors.forEach((a, i) => {
    if (a.spike) return;
    const before = anchors[(i - 1 + anchors.length) % anchors.length];
    const after = anchors[(i + 1) % anchors.length];
    if (before.spike || after.spike) a.radius *= 0.86;
  });

  anchors.sort((a, b) => a.angle - b.angle);
  return { anchors, droplets };
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * The outline as an SVG path. `wobble` is the breathing amplitude as a
 * fraction of each anchor's radius; 0 gives the resting shape.
 */
export function splatPath(shape: SplatShape, time = 0, wobble = 0) {
  const points = shape.anchors.map((a) => {
    const r = a.radius * (1 + wobble * Math.sin(time * a.speed + a.phase));
    return [Math.cos(a.angle) * r, Math.sin(a.angle) * r] as const;
  });

  const n = points.length;
  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    d +=
      `C${round(p1[0] + (p2[0] - p0[0]) / 6)} ${round(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${round(p2[0] - (p3[0] - p1[0]) / 6)} ${round(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${round(p2[0])} ${round(p2[1])}`;
  }
  return `${d}Z`;
}

/** Where a droplet sits at `time` — it drifts in and out along its throw line. */
export function dropletAt(drop: Droplet, time = 0, wobble = 0) {
  const distance = drop.distance * (1 + wobble * 0.6 * Math.sin(time * drop.speed + drop.phase));
  return {
    cx: round(Math.cos(drop.angle) * distance),
    cy: round(Math.sin(drop.angle) * distance),
    r: round(drop.radius),
  };
}
