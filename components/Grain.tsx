// Mid-grey speckles (R=G=B=0.5, alpha carries the noise) composited with
// normal alpha blending — visible on both paper and ink backgrounds, unlike
// a blend-mode approach where a black-only or white-only source goes
// invisible against a same-toned backdrop.
const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;

/**
 * Fixed film-grain overlay — a faint noise texture over the whole page to
 * soften the flat ink/paper palette. Purely decorative, sits above content
 * but never intercepts input.
 */
export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.15]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`,
        backgroundSize: "180px 180px",
      }}
    />
  );
}
