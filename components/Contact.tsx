import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import { site } from "@/content/site";

export default function Contact() {
  return (
    <Section id="contact">
      <SectionHead label="Contact" title="Let’s *talk*." titleSpan="lg:col-span-8" />

      {/* One thing to do here. The socials live in the footer, so this section
          stays a single address at full measure. */}
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 md:col-span-12">
          <Reveal>
            <Magnetic strength={0.18} padding={20} className="inline-block">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex max-w-full items-baseline gap-3 break-words font-sans text-[clamp(1rem,5.5vw,4.5rem)] font-bold leading-[0.95] tracking-tightest text-ink"
              >
                <span className="u-underline pb-1">{site.email}</span>
                <span
                  aria-hidden="true"
                  className="text-2xl transition-transform duration-500 ease-editorial group-hover:translate-x-1 sm:text-3xl"
                >
                  ↗
                </span>
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
