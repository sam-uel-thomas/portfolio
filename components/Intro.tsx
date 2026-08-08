"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import { motion as motionConfig } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * True once the page is free to animate — i.e. the intro overlay has cleared,
 * or was never shown. Above-the-fold copy waits on this so the hero doesn't
 * play its reveal behind a covering panel.
 */
const IntroContext = createContext(false);

export function useIntroReady() {
  return useContext(IntroContext);
}

const SESSION_KEY = "intro-played";

type Phase = "deciding" | "playing" | "done";

export default function Intro({ children }: { children: React.ReactNode }) {
  // Start in "deciding": the server can't know whether the intro has already
  // played this session, so the decision is deferred to the client. Rendering
  // nothing for one frame avoids a flash of the overlay on repeat visits.
  const [phase, setPhase] = useState<Phase>("deciding");

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    const skip = alreadyPlayed || prefersReducedMotion() || !motionConfig.intro;

    if (skip) {
      setPhase("done");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("playing");
  }, []);

  return (
    <IntroContext.Provider value={phase === "done"}>
      {phase === "playing" ? <Preloader onDone={() => setPhase("done")} /> : null}
      {children}
    </IntroContext.Provider>
  );
}
