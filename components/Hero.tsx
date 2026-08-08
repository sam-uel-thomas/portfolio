import Container from "@/components/Container";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import { site } from "@/content/site";

export default function Hero() {
  const [first, ...rest] = site.name.split(" ");
  const last = rest.join(" ");

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col pt-14">
      <Container className="flex flex-1 flex-col pb-10 pt-24">
        {/* Name + introduction — vertically centred */}
        <div className="flex flex-1 items-center">
          <div className="grid w-full grid-cols-4 items-end gap-y-12 md:grid-cols-12">
            <div className="col-span-4 md:col-span-9">
              {/* Lags slightly behind the scroll, so the name sits on a plane
                  just behind the rest of the page as it leaves. */}
              <Parallax speed={0.12}>
                <h1 className="font-sans text-[clamp(3.5rem,13vw,13rem)] font-bold leading-[0.84] tracking-tightest text-ink">
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
              </Parallax>
            </div>

            <Parallax
              speed={-0.04}
              className="col-span-4 md:col-span-3 md:self-end"
            >
              <TextReveal
                as="p"
                className="text-lg leading-relaxed text-ink/80"
                text={site.tagline}
                start="intro"
                delay={520}
                stagger={28}
              />
            </Parallax>
          </div>
        </div>

        {/* Bottom row. Sits right on the fold, so it waits for the intro
            rather than for a scroll that may never happen. */}
        <Reveal start="intro">
          <div className="grid grid-cols-4 items-end border-t border-ink/15 pt-6 md:grid-cols-12">
            <a
              href="#work"
              className="group u-label col-span-2 flex items-center gap-3 transition-colors duration-300 hover:text-ink md:col-span-6"
            >
              <span className="relative block h-8 w-px overflow-hidden bg-ink/30">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-scrollcue bg-ink" />
              </span>
              Scroll to explore
            </a>
            <span className="u-label col-span-2 text-right md:col-span-6">
              {site.availabilityLabel}
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
