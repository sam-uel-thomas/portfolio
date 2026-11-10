"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Letters that roll over on hover, in a wave. Each letter has a twin parked
 * just below it; on hover of the nearest `.group` both slide up one line, so
 * the twin takes the original's place.
 *
 * The twin is absolutely positioned so the letter's baseline stays its own,
 * and the clip is a `clip-path` rather than `overflow: hidden`, which would
 * move the baseline to the box's bottom edge and knock it out of line with
 * any neighbouring text.
 */
export function RollText({
  text,
  stagger = 18,
  className = "",
}: {
  text: string;
  /** Milliseconds between consecutive letters. */
  stagger?: number;
  className?: string;
}) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((char, i) => {
          const glyph = char === " " ? " " : char;
          const delay = { transitionDelay: `${i * stagger}ms` };
          return (
            <span
              key={i}
              className="relative inline-block leading-[1.15] [clip-path:inset(0_-0.1em)]"
            >
              <span
                className="inline-block transition-transform duration-500 ease-editorial group-hover:-translate-y-full group-focus-visible:-translate-y-full"
                style={delay}
              >
                {glyph}
              </span>
              <span
                className="absolute left-0 top-full inline-block transition-transform duration-500 ease-editorial group-hover:-translate-y-full group-focus-visible:-translate-y-full"
                style={delay}
              >
                {glyph}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/**
 * Copies text, falling back to the old selection-based copy where the async
 * Clipboard API is missing or refused — embedded browsers and some in-app
 * webviews deny it outright.
 */
async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(field);
    field.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      field.remove();
    }
  }
}

/**
 * The email, with a copy button beside it. A mailto link does nothing useful
 * for anyone on webmail, which is most people; copying the address works for
 * everyone.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await writeClipboard(email))) return; // The mailto link is still right there.
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-5">
      <a
        href={`mailto:${email}`}
        className="group inline-flex max-w-full items-baseline gap-3 font-sans text-[clamp(1.1rem,4.6vw,3.75rem)] font-bold tracking-tightest text-ink"
      >
        <RollText text={email} stagger={12} />
        <span
          aria-hidden="true"
          className="text-[0.5em] transition-transform duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1"
        >
          ↗
        </span>
      </a>

      <button
        type="button"
        onClick={copy}
        className="u-label relative grid h-11 items-center overflow-hidden rounded-full border border-ink/20 px-5 text-ink transition-colors duration-300 hover:border-ink"
      >
        {/* Both labels share one grid cell, so the pill is always as wide as
            the longer one and never jumps when they swap. */}
        <span
          className={`[grid-area:1/1] text-center transition-transform duration-500 ease-editorial ${
            copied ? "-translate-y-[180%]" : "translate-y-0"
          }`}
        >
          Copy address
        </span>
        <span
          aria-hidden="true"
          className={`flex items-center justify-center gap-2 text-accent [grid-area:1/1] transition-transform duration-500 ease-editorial ${
            copied ? "translate-y-0" : "translate-y-[180%]"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Copied
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
