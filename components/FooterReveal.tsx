"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

/**
 * The spacer at the end of the page flow. Its top edge is where the page
 * content currently ends, i.e. the line above which the footer is still
 * covered — so anything in the footer can work out whether it's actually
 * been uncovered yet.
 *
 * Needed because the footer is `position: fixed` at the bottom of the
 * viewport the whole time. An IntersectionObserver sees it as permanently
 * on screen, even while the page is sitting on top of it.
 */
const FooterSpacerContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

export function useFooterSpacer() {
  return useContext(FooterSpacerContext);
}

/**
 * Reveal-on-scroll footer. The footer is fixed behind the page content; a
 * spacer of matching height sits at the end of the flow, so as the content
 * scrolls past, the footer is uncovered from behind it. Height is measured
 * so it stays correct across breakpoints.
 */
export default function FooterReveal({
  id,
  children,
}: {
  /**
   * An anchor for the footer. It goes on the spacer, not the footer: the
   * footer is fixed, so scrolling to it goes nowhere, but scrolling to the
   * spacer runs the page to the end, which uncovers the footer in full.
   */
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <FooterSpacerContext.Provider value={spacerRef}>
      {/* Transparent spacer the fixed footer shows through at the bottom. */}
      <div ref={spacerRef} id={id} aria-hidden="true" style={{ height }} />
      <div ref={ref} className="fixed inset-x-0 bottom-0 z-0">
        {children}
      </div>
    </FooterSpacerContext.Provider>
  );
}
