import Container from "@/components/Container";
import Parallax from "@/components/Parallax";
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
              <h1 className="font-sans text-[clamp(3.5rem,13vw,13rem)] font-bold leading-[0.84] tracking-tightest text-ink">
                <span className="block">{first}</span>
                <span className="block pl-[10%] md:pl-[16%]">{last}</span>
              </h1>
            </div>

            <Parallax
              speed={-0.04}
              className="col-span-4 md:col-span-3 md:self-end"
            >
              <p className="text-lg leading-relaxed text-ink/80">
                {site.tagline}
              </p>
            </Parallax>
          </div>
        </div>

        {/* Bottom row */}
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
      </Container>
    </section>
  );
}
