import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";

type SectionHeadProps = {
  /** Short label, e.g. "Selected Work". */
  label: string;
  /** Large display statement. Wrap runs in *asterisks* for the serif accent. */
  title: string;
  /** Optional right-aligned meta (count…). */
  meta?: string;
  /** Columns the title should occupy on large screens. */
  titleSpan?: string;
  /** Invert colours for a dark (ink) section. */
  dark?: boolean;
};

/** Ruled section header — the recurring editorial masthead. */
export default function SectionHead({
  label,
  title,
  meta,
  titleSpan = "lg:col-span-9",
  dark = false,
}: SectionHeadProps) {
  return (
    <header className="mb-16 md:mb-24">
      <Reveal>
        <div
          className={`flex items-baseline justify-between border-b pb-4 ${
            dark ? "border-paper/20" : "border-ink/15"
          }`}
        >
          <span className={`u-label ${dark ? "text-paper" : "text-ink"}`}>
            {label}
          </span>
          {meta ? (
            <span className={`u-label ${dark ? "text-paper/50" : ""}`}>
              {meta}
            </span>
          ) : null}
        </div>
      </Reveal>
      <div className="grid grid-cols-4 md:grid-cols-12">
        <TextReveal
          as="h2"
          text={title}
          stagger={55}
          className={`col-span-4 mt-8 font-sans text-[clamp(2.25rem,5.5vw,5rem)] font-bold leading-[0.95] tracking-tightest md:mt-10 ${
            dark ? "text-paper" : "text-ink"
          } ${titleSpan}`}
        />
      </div>
    </header>
  );
}
