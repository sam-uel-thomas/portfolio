"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
 * becomes a client-side navigation home that lands on the section.
 */
export default function SectionLink({ section, className, children }: SectionLinkProps) {
  const onHome = usePathname() === "/";

  if (onHome) {
    return (
      <a href={`#${section}`} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={section === "top" ? "/" : `/#${section}`} className={className}>
      {children}
    </Link>
  );
}
