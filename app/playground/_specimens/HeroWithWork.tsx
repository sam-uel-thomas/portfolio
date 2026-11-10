"use client";

import { useState } from "react";
import HeroStack, { type StackCard } from "@/components/HeroStack";
import RollingWord from "@/components/RollingWord";

/**
 * A stand-in for the real hero: the name and rolling line on the left, and the
 * work stacked on the right, shuffling to whichever project backs up the word
 * that's showing.
 */
export default function HeroWithWork({
  first,
  last,
  lead,
  words,
  cards,
}: {
  first: string;
  last: string;
  lead: string;
  /** Each rolling word, with the title of the project that proves it. */
  words: { word: string; shows: string }[];
  cards: StackCard[];
}) {
  const [index, setIndex] = useState(0);
  const active = Math.max(
    0,
    cards.findIndex((card) => card.title === words[index]?.shows),
  );

  return (
    <div className="border border-ink/15 px-5 py-14 sm:px-8 md:px-12 md:py-20">
      <div className="grid grid-cols-4 items-center gap-y-12 md:grid-cols-12 md:gap-x-5">
        <div className="col-span-4 md:col-span-7">
          <p className="font-sans text-[clamp(3.25rem,10vw,10rem)] font-bold leading-[0.84] tracking-tightest text-ink">
            <span className="block">{first}</span>
            <span className="block pl-[10%] md:pl-[16%]">{last}</span>
          </p>
          <div className="mt-8 pl-[10%] md:mt-10 md:pl-[16%]">
            <RollingWord
              lead={lead}
              words={words.map((item) => item.word)}
              stackOnMobile
              onIndexChange={setIndex}
              className="font-sans text-[clamp(1.5rem,2.6vw,2.5rem)] font-medium leading-tight tracking-tight text-ink"
            />
          </div>
        </div>

        <div className="col-span-4 md:col-span-5">
          <HeroStack cards={cards} active={active} className="mx-auto w-[86%] md:w-[92%]" />
          <p className="u-label mt-8 text-center">
            <span className="text-ink">{cards[active]?.title}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
