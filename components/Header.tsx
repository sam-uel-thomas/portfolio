"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { site } from "@/content/site";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * Editorial top bar: wordmark, live availability status, numbered nav and
 * local time. A hairline + blur fade in once the user leaves the hero.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-editorial ${
        scrolled
          ? "border-b border-line bg-paper/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="relative flex h-14 items-center justify-between">
        <a
          href="#top"
          className="flex shrink-0 items-baseline gap-1 whitespace-nowrap font-sans text-lg font-bold tracking-tight text-ink transition-opacity duration-300 hover:opacity-60"
        >
          {site.name}
          <sup className="font-mono text-[0.55rem] text-muted">©</sup>
        </a>

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
            <a
              key={link.href}
              href={link.href}
              className="u-label transition-colors duration-300 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
