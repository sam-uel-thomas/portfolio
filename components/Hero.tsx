"use client";

import { useState } from "react";
import Container from "@/components/Container";
import HeroStack from "@/components/HeroStack";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import RollingWord from "@/components/RollingWord";
import TextReveal from "@/components/TextReveal";
import { heroRoll, projects, site } from "@/content/site";

// Only projects with a screenshot can be a card.
const cards = projects.flatMap((project) =>
  project.image ? [{ title: project.title, image: project.image }] : [],
);

export default function Hero() {
  const [first, ...rest] = site.name.split(" ");
  const last = rest.join(" ");

  // Which rolling word is showing decides which project is on top of the
  // stack, so the line makes a claim and the picture beside it backs it up.
  const [wordIndex, setWordIndex] = useState(0);
  const active = Math.max(
    0,
    cards.findIndex((card) => card.title === heroRoll.words[wordIndex]?.shows),
  );

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col pt-14">
      <Container className="flex flex-1 flex-col pb-10 pt-24">
        {/* Name + the work — vertically centred */}
        <div className="flex flex-1 items-center">
          <div className="grid w-full grid-cols-4 items-center gap-y-14 md:grid-cols-12 md:gap-x-5">
            <div className="col-span-4 md:col-span-7">
              {/* Lags slightly behind the scroll, so the name sits on a plane
                  just behind the rest of the page as it leaves. */}
              <Parallax speed={0.12}>
                <h1 className="font-sans text-[clamp(3.5rem,11vw,12rem)] font-bold leading-[0.84] tracking-tightest text-ink">
                  <TextReveal
                    as="span"
                    className="block"
                    text={first}
                    start="intro"
                    delay={120}
                  />
                  <TextReveal
                    as="span"
                    className="block pl-[10%] md:pl-[16%]"
                    text={last}
                    start="intro"
                    delay={240}
                  />
                </h1>

                {/* Indented to the second line of the name, so it reads as
                    hanging off "Thomas" rather than as a new block. Arrives
                    after the name has landed, then starts rolling. */}
                <Reveal start="intro" delay={700} className="mt-8 pl-[10%] md:mt-10 md:pl-[16%]">
                  <RollingWord
                    lead={heroRoll.lead}
                    words={heroRoll.words.map((item) => item.word)}
                    stackOnMobile
                    onIndexChange={setWordIndex}
                    className="font-sans text-[clamp(1.5rem,2.8vw,2.75rem)] font-medium leading-tight tracking-tight text-ink"
                  />
                </Reveal>
              </Parallax>
            </div>

            {/* The work, in the first screen. Drifts the other way to the
                name on scroll, so the two separate as the hero leaves. */}
            <Parallax speed={-0.04} className="col-span-4 md:col-span-5">
              <HeroStack cards={cards} active={active} className="mx-auto w-[84%] md:w-[90%]" />
              <Reveal start="intro" delay={900}>
                <p className="u-label mt-8 text-center text-ink">{cards[active]?.title}</p>
              </Reveal>
            </Parallax>
          </div>
        </div>

        {/* Bottom row. Sits right on the fold, so it waits for the intro
            rather than for a scroll that may never happen. */}
        <Reveal start="intro">
          {/* Availability lives in the header, where it stays visible past the
              fold. Repeating it down here only drew attention to how little
              else this row was carrying. */}
          <div className="border-t border-ink/15 pt-6">
            <a
              href="#work"
              className="group u-label flex w-fit items-center gap-3 transition-colors duration-300 hover:text-ink"
            >
              <span className="relative block h-8 w-px overflow-hidden bg-ink/30">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-scrollcue bg-ink" />
              </span>
              Scroll to see more
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
