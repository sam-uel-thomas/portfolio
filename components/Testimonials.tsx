import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import { testimonials } from "@/content/site";

export default function Testimonials() {
  // Removing the quotes from content/site.ts removes the section — no dead
  // heading left behind over an empty list.
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials" tone="ink">
      <SectionHead
        label="Testimonials"
        title="What clients *say*."
        meta={`(${String(testimonials.length).padStart(2, "0")})`}
        dark
      />

      <div className="border-t border-paper/15">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.name} delay={index * 70}>
            <figure className="group grid grid-cols-4 gap-y-6 border-b border-paper/15 py-10 transition-colors duration-500 ease-editorial md:grid-cols-12 md:gap-x-5 md:py-14">
              <blockquote className="col-span-4 md:col-span-8">
                <p className="text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium leading-snug tracking-tight text-paper/70 transition-colors duration-500 ease-editorial group-hover:text-paper">
                  <span aria-hidden="true" className="u-accent text-paper/40">
                    “
                  </span>
                  {testimonial.quote}
                  <span aria-hidden="true" className="u-accent text-paper/40">
                    ”
                  </span>
                </p>
              </blockquote>
              <figcaption className="col-span-4 self-start md:col-span-3 md:col-start-10 md:pt-2">
                <p className="text-base font-medium text-paper">
                  {testimonial.name}
                </p>
                <p className="u-label mt-1 text-paper/50">{testimonial.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
