"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll footer. The footer is fixed behind the page content; a
 * spacer of matching height sits at the end of the flow, so as the content
 * scrolls past, the footer is uncovered from behind it. Height is measured
 * so it stays correct across breakpoints.
 */
export default function FooterReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
    <>
      {/* Transparent spacer the fixed footer shows through at the bottom. */}
      <div aria-hidden="true" style={{ height }} />
      <div ref={ref} className="fixed inset-x-0 bottom-0 z-0">
        {children}
      </div>
    </>
  );
}
