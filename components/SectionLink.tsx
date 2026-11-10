"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/PageTransition";

type SectionLinkProps = {
  /** A home page section id, without the hash. "top" means the page itself. */
  section: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * A link to a section of the home page that works from any page.
 *
 * On the home page it's a plain hash link, which the smooth scroller picks up
 * and glides to. Anywhere else there's no such section to glide to, so it
 * becomes a navigation home, behind the page transition, that lands on the
 * section.
 */
/** Sections in the page frame rather than the home page, so every page has them. */
const ON_EVERY_PAGE = new Set(["contact"]);

export default function SectionLink({ section, className, children }: SectionLinkProps) {
  const onHome = usePathname() === "/";

  if (onHome || ON_EVERY_PAGE.has(section)) {
    return (
      <a href={`#${section}`} className={className}>
        {children}
      </a>
    );
  }

  return (
    <TransitionLink href={section === "top" ? "/" : `/#${section}`} className={className}>
      {children}
    </TransitionLink>
  );
}
