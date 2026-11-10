"use client";

import { useEffect, useRef, useState } from "react";
import { useIntroReady } from "@/components/Intro";
import type { CaseImage } from "@/content/site";

type CaseFigureProps = {
  image: CaseImage;
  /** Wait for the intro overlay to clear as well as for the scroll. */
  start?: "view" | "intro";
  /**
   * Show part of the image in a frame of this shape, instead of all of it.
   * `position` is a CSS object-position, e.g. "100% 50%" keeps the right edge.
   */
  crop?: { aspect: string; position?: string };
  /**
   * What it sits on. On a dark section the canvas card would glare, so the
   * mount becomes a faint lift of the dark instead.
   */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * A screenshot, mounted on a card of canvas — or, for an image marked
 * `bare`, shown as it is.
 *
 * The mount is for whole pages: they're white like this site, and set
 * straight onto it they'd have no edge at all. Product illustrations are
 * already composed on white and don't need one.
 *
 * The card wipes open from its bottom edge as it scrolls into view, while the
 * picture inside settles back from a slight zoom — the same rise-out-of-a-mask
 * the site's type uses, at the size of an image.
 */
export default function CaseFigure({
  image,
  start = "view",
  crop,
  tone = "light",
  className = "",
}: CaseFigureProps) {
  const dark = tone === "dark";
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const introReady = useIntroReady();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visible = inView && (start === "view" || introReady);

  return (
    // The observer watches the figure, and the wipe is on the div inside it:
    // a box clipped down to nothing can't be relied on to report as visible.
    <figure ref={ref} className={`fig ${visible ? "is-in" : ""} ${className}`.trim()}>
      <div
        className={`fig-mask overflow-hidden ${
          image.bare ? "" : `${dark ? "bg-paper/[0.06]" : "bg-canvas"} p-3 sm:p-6 md:p-10 lg:p-14`
        }`}
      >
        <div
          className={
            image.bare
              ? "overflow-hidden"
              : `overflow-hidden border bg-paper ${dark ? "border-paper/10" : "border-ink/10"}`
          }
          style={crop ? { aspectRatio: crop.aspect } : undefined}
        >
          {/* Not lazy, on purpose. The browser decides whether a lazy image
              is near the viewport after applying its ancestors' clipping, and
              this one sits inside a mask that's clipped to nothing until it
              opens — so it wouldn't start loading until the wipe had already
              begun, and the card would open on an empty frame. These are
              small files and the whole point of the page. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            decoding="async"
            className={`fig-img block w-full ${crop ? "h-full object-cover" : "h-auto"}`}
            style={crop?.position ? { objectPosition: crop.position } : undefined}
          />
        </div>
      </div>
    </figure>
  );
}
