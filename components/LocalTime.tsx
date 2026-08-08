"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

/**
 * Sam's local time, ticking. Small human signal in an otherwise formal header —
 * and a practical one for anyone working out whether to expect a reply today.
 *
 * Renders nothing until mounted: the server and the visitor's machine will
 * disagree about the current second, and a hydration mismatch here isn't worth
 * the two characters it would save.
 */
export default function LocalTime({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: site.timezone,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span className={className}>
      <span className="tabular-nums">{time}</span> LDN
    </span>
  );
}
