"use client";

import { Fragment, useEffect, useRef } from "react";
import { parseAccentWords } from "@/components/TextReveal";
import { prefersReducedMotion } from "@/lib/motion";

/** Opacity of a word the reading edge hasn't reached yet. */
const UNREAD = 0.16;
/** How many words the edge is feathered across, so it sweeps rather than ticks. */
const FEATHER = 5;

/**
 * Copy that fills in word by word as it scrolls through the viewport, and
 * empties again on the way back up. Unlike the one-shot reveal it's scrubbed:
 * the reading edge sits wherever the scroll puts it, so it reads at the
 * visitor's pace.
 *
 * Opacity is written straight to each word from one scroll handler — no state,
 * no re-render, one layout read per frame.
 */
export default function ScrubText({
  paragraphs,
  className = "",
}: {
  paragraphs: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));

    if (prefersReducedMotion()) {
      words.forEach((word) => (word.style.opacity = "1"));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts as the block's top passes 80% down the screen, finishes as its
      // bottom passes 35% — so the last line completes mid-screen, not at the
      // very top where nobody's reading.
      const start = vh * 0.8;
      const end = vh * 0.35;
      const progress = Math.min(
        Math.max((start - rect.top) / (rect.height + start - end), 0),
        1,
      );
      const edge = progress * (words.length + FEATHER);
      words.forEach((word, i) => {
        const fill = Math.min(Math.max((edge - i) / FEATHER, 0), 1);
        word.style.opacity = String(UNREAD + (1 - UNREAD) * fill);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {paragraphs.map((paragraph, p) => {
        const words = parseAccentWords(paragraph);
        return (
          <p key={p} className="mb-6 last:mb-0">
            {words.map((parts, i) => (
              <Fragment key={i}>
                {/* Dimmed only under `.js`, so without scripts it's plain text. */}
                <span data-word className="[.js_&]:opacity-[0.16]">
                  {parts.map((part, j) =>
                    part.accent ? (
                      <span key={j} className="u-accent">
                        {part.text}
                      </span>
                    ) : (
                      <Fragment key={j}>{part.text}</Fragment>
                    ),
                  )}
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
