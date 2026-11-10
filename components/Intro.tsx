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

/**
 * The same signal, for things that animate in off the back of it — held back
 * until the component has been on screen for a frame.
 *
 * The intro only plays once a session. Arrive at a page by a link from another
 * one and it's long finished, so a component mounting there would be born
 * already in its end state and simply appear. Waiting a painted frame gives
 * the transition a hidden state to start from, so it plays on every arrival.
 */
export function useIntroStart() {
  const ready = useContext(IntroContext);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    // Two frames: the first callback can land before the hidden state has
    // actually been painted, and a transition needs something to move from.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setPainted(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  return ready && painted;
}

/**
 * Holds everything inside it back from animating while `hold` is true — for
 * a page transition, so the incoming page waits behind the cover and makes
 * its entrance as the cover lifts, instead of playing it unseen.
 */
export function IntroGate({ hold, children }: { hold: boolean; children: React.ReactNode }) {
  const ready = useContext(IntroContext);
  return <IntroContext.Provider value={ready && !hold}>{children}</IntroContext.Provider>;
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
