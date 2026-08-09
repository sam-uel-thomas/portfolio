import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import TextReveal from "@/components/TextReveal";
import { about, site } from "@/content/site";

/**
 * The one dark section in the page body. It carries the tonal break the scroll
 * needs, and About earns it — it's the statement section, and inverting it
 * makes the claim land instead of scrolling past as more grey text.
 */
export default function About() {
  return (
    <Section id="about" tone="ink">
      <SectionHead
        label="About"
        title="I build the *whole* thing."
        titleSpan="lg:col-span-8"
        dark
      />

      <div className="grid grid-cols-4 gap-y-14 md:grid-cols-12 md:gap-x-5">
        {/* Statement */}
        <div className="col-span-4 md:col-span-7 lg:col-span-6">
          {about.paragraphs.map((paragraph, index) => (
            <TextReveal
              key={index}
              as="p"
              text={paragraph}
              stagger={18}
              className="mb-6 font-sans text-[clamp(1.5rem,2.4vw,2.15rem)] font-medium leading-snug tracking-tight text-paper"
            />
          ))}
        </div>

        {/* Meta column */}
        <div className="col-span-4 md:col-span-4 md:col-start-9">
          <Reveal delay={120}>
            <div className="border-t border-paper/20 pt-5">
              <p className="u-label mb-4 text-paper/50">Stack</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {about.stack.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-2 text-base text-paper"
                  >
                    <span className="font-mono text-xs text-paper/40">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-paper/20 pt-5">
              <p className="u-label mb-3 text-paper/50">Based in</p>
              <p className="text-base text-paper">{site.location}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
