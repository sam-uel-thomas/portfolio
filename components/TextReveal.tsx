"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useIntroReady } from "@/components/Intro";

type Part = { text: string; accent: boolean };
/** One visual word — may be several parts when an accent run ends mid-word. */
type Word = Part[];

/**
 * Splits a string into words, tracking which parts came from an *accented* run.
 *
 * Words rather than segments, because each word gets its own mask: splitting
 * naively on the asterisks would strand the full stop in "*works*." as a word
 * of its own, complete with a leading space. So accent runs are resolved first
 * and word boundaries second, letting a single word carry mixed styling.
 */
function parse(text: string): Word[] {
  const chunks: Part[] = text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((segment) => {
      const accent = segment.length > 2 && segment.startsWith("*") && segment.endsWith("*");
      return { text: accent ? segment.slice(1, -1) : segment, accent };
    });

  const words: Word[] = [];
  let current: Word = [];

  for (const chunk of chunks) {
    for (const piece of chunk.text.split(/(\s+)/)) {
      if (!piece) continue;
      if (/^\s+$/.test(piece)) {
        if (current.length) {
          words.push(current);
          current = [];
        }
      } else {
        current.push({ text: piece, accent: chunk.accent });
      }
    }
  }
  if (current.length) words.push(current);

  return words;
}

type TextRevealProps = {
  /** Source copy. Wrap runs in *asterisks* for the serif italic accent. */
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** Milliseconds between consecutive words. */
  stagger?: number;
  /** Milliseconds before the first word moves. */
  delay?: number;
  /**
   * "view"  — reveal when scrolled into view (default).
   * "intro" — reveal once the intro sequence has finished. For above-the-fold
   *           copy, which is already in view before the overlay clears.
   */
  start?: "view" | "intro";
};

/**
 * Type that rises into place a word at a time from behind a mask.
 *
 * Word-level rather than line-level on purpose: no measuring, no re-splitting
 * on resize, and it survives any font or wrapping change. The stagger reads as
 * a line sweep at these sizes anyway.
 */
export default function TextReveal({
  text,
  as: Tag = "span",
  className = "",
  stagger = 45,
  delay = 0,
  start = "view",
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const introReady = useIntroReady();

  useEffect(() => {
    if (start !== "view") return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [start]);

  const visible = start === "intro" ? introReady : inView;
  const words = parse(text);
  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      className={`tr ${visible ? "is-in" : ""} ${className}`.trim()}
    >
      {words.map((parts, i) => (
        <Fragment key={i}>
          <span className="tr-word">
            <span
              className="tr-inner"
              style={{ transitionDelay: `${delay + i * stagger}ms` }}
            >
              {parts.map((part, j) =>
                part.accent ? (
                  <span key={j} className="u-accent">
                    {part.text}
                  </span>
                ) : (
                  <Fragment key={j}>{part.text}</Fragment>
                )
              )}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Component>
  );
}

/**
 * Same accent parsing, no motion — for copy that shouldn't be animated but
 * still wants the serif italic exception (nav, captions, footer).
 */
export function AccentText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(\*[^*]+\*)/g)
        .filter(Boolean)
        .map((segment, i) => {
          const accent =
            segment.length > 2 && segment.startsWith("*") && segment.endsWith("*");
          return accent ? (
            <span key={i} className="u-accent">
              {segment.slice(1, -1)}
            </span>
          ) : (
            <Fragment key={i}>{segment}</Fragment>
          );
        })}
    </>
  );
}
