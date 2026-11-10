"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { IntroGate } from "@/components/Intro";
import { lenisRef } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/motion";

type Go = (href: string, label?: string) => void;

const TransitionContext = createContext<Go | null>(null);

/** Cover in, then lift away. Kept in step with the CSS durations below. */
const COVER_MS = 650;
const REVEAL_MS = 800;
/** If the new page never arrives, lift the cover anyway rather than strand the visitor. */
const GIVE_UP_MS = 4000;

type Phase = "idle" | "covering" | "covered" | "revealing";

/**
 * Moves between pages behind an ink panel. It rises over the page, the route
 * changes underneath it, and it carries on upward off the new page, which
 * makes its entrance as the panel clears.
 *
 * Lives in the root layout, which persists across navigations, so the same
 * panel is on screen before and after the route changes.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const fromPath = useRef(pathname);
  const target = useRef("");
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const reveal = useCallback(() => {
    setPhase("revealing");
    later(() => setPhase("idle"), REVEAL_MS);
  }, []);

  const go = useCallback<Go>(
    (href, nextLabel = "") => {
      if (phase !== "idle") return;
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      fromPath.current = window.location.pathname;
      target.current = href;
      setLabel(nextLabel);
      setPhase("covering");
      later(() => {
        setPhase("covered");
        // Scrolling is ours (see `land` below), not the router's: its
        // scroll-on-navigate and the smooth scroller each think they know
        // where the page is, and the page could arrive part-way down.
        router.push(href, { scroll: false });
        later(() => setPhase((p) => (p === "covered" ? "revealing" : p)), GIVE_UP_MS);
      }, COVER_MS);
    },
    [phase, router],
  );

  // The new route has rendered: put it where it should open — its top, or
  // the section the link named — while it's still covered, give it two
  // frames to paint its hidden state, then lift the cover.
  useEffect(() => {
    if (phase !== "covered" || pathname === fromPath.current) return;
    const hash = new URL(target.current, window.location.href).hash;
    const section = hash ? document.querySelector<HTMLElement>(hash) : null;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(section ?? 0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, section ? section.getBoundingClientRect().top + window.scrollY : 0);
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(reveal);
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [pathname, phase, reveal]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const transform =
    phase === "covering" || phase === "covered"
      ? "translateY(0%)"
      : phase === "revealing"
        ? "translateY(-100%)"
        : "translateY(100%)";

  return (
    <TransitionContext.Provider value={go}>
      {/* Pages wait behind the cover until it starts to lift. */}
      <IntroGate hold={phase === "covered"}>{children}</IntroGate>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] flex items-end bg-ink"
        style={{
          transform,
          // Parked below the screen with no transition, so resetting after a
          // lift doesn't sweep back down across the page.
          transition:
            phase === "idle"
              ? "none"
              : `transform ${phase === "revealing" ? REVEAL_MS : COVER_MS}ms var(--ease-editorial)`,
          visibility: phase === "idle" ? "hidden" : "visible",
        }}
      >
        {/* Always mounted, so the name has somewhere to rise from: it's set
            in the same render that starts the cover, and a freshly mounted
            element would simply appear in its end position. */}
        <div className="mx-auto w-full max-w-[1680px] overflow-hidden px-5 pb-8 pt-[0.1em] sm:px-8 md:pb-12 lg:px-12">
          <p
            className="font-sans text-[clamp(3rem,12vw,12rem)] font-bold leading-[0.84] tracking-tightest text-paper"
            style={{
              transform: phase === "idle" ? "translateY(115%)" : "translateY(0)",
              transition:
                phase === "idle" ? "none" : "transform 900ms var(--ease-editorial) 120ms",
            }}
          >
            {label || " "}
          </p>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

/**
 * A next/link that changes page behind the transition. Modified clicks
 * (new tab, new window) and middle clicks are left to the browser.
 */
export function TransitionLink({
  href,
  label,
  className,
  children,
  ...rest
}: React.ComponentProps<typeof Link> & { href: string; label?: string }) {
  const go = useContext(TransitionContext);

  return (
    <Link
      href={href}
      className={className}
      {...rest}
      onClick={(event) => {
        rest.onClick?.(event);
        if (
          !go ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        go(href, label);
      }}
    >
      {children}
    </Link>
  );
}
