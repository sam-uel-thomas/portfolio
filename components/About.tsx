import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import ScrubText from "@/components/ScrubText";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import { about, projects } from "@/content/site";

// Every project with a period on it, in the order the work is listed.
const experience = projects.flatMap((project) =>
  project.period
    ? [
        {
          name: project.title,
          detail: project.contract ? `${project.role} · Contract` : project.role,
          period: project.period,
        },
      ]
    : [],
);

const education = about.education.map((item) => ({
  name: item.place,
  detail: item.course,
  period: item.period,
}));

/** A ruled list of name, detail and dates, like the top of a CV. */
function Timeline({
  title,
  rows,
  className = "",
}: {
  title: string;
  rows: { name: string; detail: string; period: string }[];
  className?: string;
}) {
  if (!rows.length) return null;
  return (
    <div className={`border-t border-ink/15 pt-5 ${className}`}>
      <h3 className="u-label mb-1">{title}</h3>
      <ol>
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-3 last:border-b-0"
          >
            <div>
              <p className="text-base font-medium text-ink">{row.name}</p>
              <p className="mt-0.5 text-sm leading-snug text-muted">{row.detail}</p>
            </div>
            <p className="shrink-0 text-sm tabular-nums text-ink/60">{row.period}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * The statement section, set on the warm canvas as a panel laid over the end
 * of the dark Work section.
 *
 * It's light because it's the last section before the footer, which is dark:
 * a dark About would run straight into it with no edge, and the footer's
 * reveal wouldn't show.
 *
 * The negative margin pulls it up over Work by the radius of its corners, so
 * what shows in the rounded corners is Work's ink, not a notch of white.
 */
export default function About() {
  return (
    <Section id="about" tone="canvas" className="-mt-7 md:-mt-10">
      <SectionHead label="About" title="I build the *whole* thing." titleSpan="lg:col-span-8" />

      <div className="grid grid-cols-4 gap-y-14 md:grid-cols-12 md:gap-x-5">
        {/* Statement — fills in word by word with the scroll, and empties
            again on the way back up, so it reads at the visitor's pace. */}
        <ScrubText
          paragraphs={about.paragraphs}
          className="col-span-4 font-sans text-[clamp(1.5rem,2.4vw,2.15rem)] font-medium leading-snug tracking-tight text-ink md:col-span-7 lg:col-span-6"
        />

        {/* Meta column: where you've worked and studied, then what with. The
            experience comes first because it's what someone hiring looks for
            first. */}
        <div className="col-span-4 md:col-span-4 md:col-start-9">
          <Reveal delay={120}>
            <Timeline title="Experience" rows={experience} className="mb-10" />
            <Timeline title="Education" rows={education} className="mb-10" />

            <div className="border-t border-ink/15 pt-5">
              <p className="u-label mb-4">Stack</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {about.stack.map((item) => (
                  <li key={item}>
                    {/* Nothing to click — the lean is just a reward for
                        running the cursor down the list. `w-fit` keeps the
                        magnet on the text rather than the whole grid cell,
                        so neighbours don't all react at once. */}
                    <Magnetic
                      strength={0.4}
                      padding={16}
                      className="flex w-fit items-baseline gap-2 text-base text-ink"
                    >
                      <span className="text-xs text-ink/40">+</span>
                      {item}
                    </Magnetic>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
