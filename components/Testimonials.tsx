import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import { testimonials } from "@/content/site";

export default function Testimonials() {
  return (
    <Section id="testimonials" tone="ink">
      <SectionHead
        label="Testimonials"
        title="What clients say."
        meta={`(0${testimonials.length})`}
        dark
      />

      <div className="border-t border-paper/15">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.name} delay={index * 70}>
            <figure className="grid grid-cols-4 gap-y-6 border-b border-paper/15 py-10 md:grid-cols-12 md:gap-x-5 md:py-14">
              <blockquote className="col-span-4 md:col-span-8">
                <p className="text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium leading-snug tracking-tight text-paper">
                  “{testimonial.quote}”
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
