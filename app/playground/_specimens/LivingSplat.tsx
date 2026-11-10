"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EASE_CSS, damp, prefersReducedMotion } from "@/lib/motion";
import { SPLAT_VIEWBOX, dropletAt, makeSplat, splatPath, type SplatShape } from "./splat";

type Thrown = {
  id: number;
  x: number;
  y: number;
  /** Rendered box in px. The body is roughly size / 2.6 across. */
  size: number;
  seed: number;
  rotate: number;
};

/** Oldest splats are swept away past this, so a click-happy visitor can't bury the page. */
const MAX_THROWN = 14;
/** How long a thrown splat stays before it fades. */
const LINGER_MS = 2600;

const randomSeed = () => Math.floor(Math.random() * 1e9);

/**
 * One thrown splat. It lands with a squash past full size and settles, its
 * droplets fly out from the centre a beat later, and after a while it fades
 * and asks to be removed.
 */
function ThrownSplat({ splat, onDone }: { splat: Thrown; onDone: (id: number) => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const [shape] = useState(() => makeSplat(splat.seed));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = prefersReducedMotion();
    const running: Animation[] = [];
    const turn = `rotate(${splat.rotate}deg)`;

    if (!reduced) {
      running.push(
        node.animate(
          [
            { transform: `${turn} scale(0.2)`, opacity: 0 },
            { transform: `${turn} scale(1.16)`, opacity: 1, offset: 0.45 },
            { transform: `${turn} scale(0.95)`, offset: 0.75 },
            { transform: `${turn} scale(1)` },
          ],
          { duration: 520, easing: EASE_CSS },
        ),
      );
      node.querySelectorAll("circle").forEach((drop, i) => {
        running.push(
          drop.animate(
            [
              { transform: "scale(0.35)", opacity: 0 },
              { transform: "scale(1)", opacity: 1 },
            ],
            { duration: 480, delay: 70 + i * 45, easing: EASE_CSS, fill: "backwards" },
          ),
        );
      });
    }

    const timer = window.setTimeout(() => {
      const fade = node.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: reduced ? 300 : 900,
        easing: "ease-in",
        fill: "forwards",
      });
      fade.onfinish = () => onDone(splat.id);
      running.push(fade);
    }, LINGER_MS);

    return () => {
      window.clearTimeout(timer);
      running.forEach((animation) => animation.cancel());
    };
  }, [splat, onDone]);

  return (
    <svg
      ref={ref}
      viewBox={SPLAT_VIEWBOX}
      aria-hidden="true"
      className="absolute text-accent"
      style={{
        left: splat.x - splat.size / 2,
        top: splat.y - splat.size / 2,
        width: splat.size,
        height: splat.size,
        transform: `rotate(${splat.rotate}deg)`,
      }}
    >
      <path d={splatPath(shape)} fill="currentColor" />
      {shape.droplets.map((drop, i) => (
        <circle
          key={i}
          {...dropletAt(drop)}
          fill="currentColor"
          // Scale from the splat's centre, so droplets read as flung outward.
          style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
        />
      ))}
    </svg>
  );
}

/**
 * The favicon's splat as a living brand mark. It breathes and turns slowly on
 * its own, gets excited under the cursor, and throws itself into a new shape
 * when clicked.
 */
function LivingMark() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dropRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [shape, setShape] = useState<SplatShape>(() => makeSplat(20251110));
  const shapeRef = useRef(shape);
  const hovered = useRef(false);

  useEffect(() => {
    shapeRef.current = shape;
  }, [shape]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const button = buttonRef.current;
    if (!button) return;

    let frame = 0;
    let last = performance.now();
    let time = 0;
    let wobble = 0.035;
    let spinSpeed = 8;
    let spin = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      const excited = hovered.current;
      wobble = damp(wobble, excited ? 0.11 : 0.035, 6, dt);
      spinSpeed = damp(spinSpeed, excited ? 46 : 8, 4, dt);
      spin = (spin + spinSpeed * dt) % 360;

      const current = shapeRef.current;
      pathRef.current?.setAttribute("d", splatPath(current, time * 1.6, wobble));
      current.droplets.forEach((drop, i) => {
        const node = dropRefs.current[i];
        if (!node) return;
        const { cx, cy } = dropletAt(drop, time * 1.6, wobble);
        node.setAttribute("cx", String(cx));
        node.setAttribute("cy", String(cy));
      });
      if (svgRef.current) svgRef.current.style.transform = `rotate(${spin}deg)`;

      frame = requestAnimationFrame(tick);
    };

    // Only animate while it can be seen.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    observer.observe(button);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const reshuffle = () => {
    setShape(makeSplat(randomSeed()));
    if (prefersReducedMotion()) return;
    // The squash hides the swap: the old shape collapses, the new one pops out.
    buttonRef.current?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.55, 0.45)", offset: 0.25 },
        { transform: "scale(1.22)", offset: 0.55 },
        { transform: "scale(0.94)", offset: 0.8 },
        { transform: "scale(1)" },
      ],
      { duration: 620, easing: "ease-out" },
    );
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={reshuffle}
      // Thrown splats listen on the stage — a click here is for the mark only.
      onPointerDown={(event) => event.stopPropagation()}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
      aria-label="Reshape the splat"
      // Most of the box is margin for the spikes and droplets, so it's drawn
      // big and pulled back out of the line with negative margins.
      className="pointer-events-auto relative -my-[0.4em] -ml-[0.12em] inline-block h-[1.3em] w-[1.3em] cursor-pointer align-top text-accent"
    >
      <svg ref={svgRef} viewBox={SPLAT_VIEWBOX} aria-hidden="true" className="h-full w-full">
        <path ref={pathRef} d={splatPath(shape)} fill="currentColor" />
        {shape.droplets.map((drop, i) => (
          <circle
            key={i}
            ref={(node) => {
              dropRefs.current[i] = node;
            }}
            {...dropletAt(drop)}
            fill="currentColor"
          />
        ))}
      </svg>
    </button>
  );
}

export default function LivingSplat({ first, last }: { first: string; last: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [thrown, setThrown] = useState<Thrown[]>([]);
  const nextId = useRef(0);

  const remove = useCallback((id: number) => {
    setThrown((all) => all.filter((splat) => splat.id !== id));
  }, []);

  const fling = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const splat: Thrown = {
      id: nextId.current++,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      size: 150 + Math.random() * 130,
      seed: randomSeed(),
      rotate: Math.random() * 360,
    };
    setThrown((all) => [...all.slice(-(MAX_THROWN - 1)), splat]);
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={fling}
      className="relative flex min-h-[26rem] cursor-crosshair select-none items-center overflow-hidden border border-ink/15 bg-paper px-6 py-16 md:min-h-[34rem] md:px-12"
    >
      <div aria-hidden="true" className="absolute inset-0">
        {thrown.map((splat) => (
          <ThrownSplat key={splat.id} splat={splat} onDone={remove} />
        ))}
      </div>

      <p className="pointer-events-none relative font-sans text-[clamp(3.25rem,10vw,9rem)] font-bold leading-[0.84] tracking-tightest text-ink">
        <span className="block">{first}</span>
        {/* nowrap keeps the mark tucked against the name rather than
            dropping to a line of its own. */}
        <span className="block whitespace-nowrap pl-[10%] md:pl-[16%]">
          {last}
          <LivingMark />
        </span>
      </p>

      <div className="pointer-events-none absolute inset-x-6 bottom-5 flex flex-wrap justify-between gap-2 md:inset-x-12">
        <span className="u-label">Click anywhere to throw paint</span>
        <span className="u-label">Click the mark to reshape it</span>
      </div>
    </div>
  );
}
