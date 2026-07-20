import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import { site } from "@/content/site";

export default function Contact() {
  return (
    <Section id="contact">
      <SectionHead
        label="Contact"
        title="Get in touch."
        titleSpan="lg:col-span-8"
      />

      <div className="grid grid-cols-4 gap-y-14 md:grid-cols-12 md:gap-x-5">
        {/* Email */}
        <div className="col-span-4 md:col-span-12">
          <Reveal>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex max-w-full items-baseline gap-3 break-words font-sans text-[clamp(1.5rem,5.5vw,4.5rem)] font-bold leading-[0.95] tracking-tightest text-ink"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_2px]">
                {site.email}
              </span>
              <span
                aria-hidden="true"
                className="text-2xl transition-transform duration-500 ease-editorial group-hover:translate-x-1 sm:text-3xl"
              >
                ↗
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
