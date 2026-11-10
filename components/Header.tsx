"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/Container";
import ScrollProgress from "@/components/ScrollProgress";
import SectionLink from "@/components/SectionLink";
import { site } from "@/content/site";

// In page order. Work and About are home page sections: SectionLink scrolls
// to them on the home page and navigates back to them from anywhere else.
// Contact is the footer, so it scrolls to the end of whichever page you're on.
const links = [
  { label: "Work", section: "work" },
  { label: "About", section: "about" },
  { label: "Contact", section: "contact" },
];

/**
 * Editorial top bar: wordmark, live availability status, nav and local time.
 *
 * It gets out of the way while you're reading down the page and returns the
 * moment you scroll back up — the nav is there when you go looking for it and
 * absent when you don't.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      const delta = y - lastY.current;
      // Ignore sub-pixel jitter and rubber-banding at the very top.
      if (Math.abs(delta) > 6 && y > 120) {
        setHidden(delta > 0);
      } else if (y <= 120) {
        setHidden(false);
      }
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-editorial ${
        scrolled
          ? "border-b border-line bg-paper/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <Container className="relative flex h-14 items-center justify-between">
        <SectionLink
          section="top"
          className="flex shrink-0 items-baseline gap-1 whitespace-nowrap font-sans text-lg font-bold tracking-tight text-ink transition-opacity duration-300 hover:opacity-60"
        >
          {site.name}
          <sup className="text-[0.55rem] text-muted">©</sup>
        </SectionLink>

        {site.available ? (
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="u-label">{site.availabilityLabel}</span>
          </div>
        ) : null}

        <nav className="flex items-center gap-4 sm:gap-7">
          {links.map((link) => (
            <SectionLink
              key={link.section}
              section={link.section}
              className="u-label u-underline hover:text-ink"
            >
              {link.label}
            </SectionLink>
          ))}
        </nav>
      </Container>

      <ScrollProgress />
    </header>
  );
}
