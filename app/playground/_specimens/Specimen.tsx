import Container from "@/components/Container";
import { AccentText } from "@/components/TextReveal";

export type SpecimenInfo = {
  n: string;
  title: string;
  kind: string;
  /** Where on the real site it would go. */
  lives: string;
  note: string;
  /** Copy in this specimen is a first draft and needs Sam's eye. */
  draft?: boolean;
};

/**
 * One numbered idea: a ruled caption block saying what it is and where it
 * would live, then the working prototype beneath it.
 */
export default function Specimen({
  info,
  bleed = false,
  children,
}: {
  info: SpecimenInfo;
  /** Let the stage run edge to edge instead of sitting in the measure. */
  bleed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={`specimen-${info.n}`} className="scroll-mt-8 py-16 md:py-24">
      <Container>
        <div className="mb-10 grid grid-cols-4 gap-y-5 border-t border-ink/15 pt-5 md:mb-14 md:grid-cols-12 md:gap-x-5">
          <span className="u-label col-span-4 text-ink md:col-span-1">{info.n}</span>
          <div className="col-span-4 md:col-span-7">
            <h2 className="font-sans text-[clamp(1.85rem,3.4vw,3rem)] font-bold leading-[0.95] tracking-tightest text-ink">
              <AccentText text={info.title} />
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">{info.note}</p>
          </div>
          <dl className="col-span-4 grid grid-cols-2 gap-x-5 gap-y-4 self-start md:col-span-3 md:col-start-10 md:grid-cols-1">
            <div>
              <dt className="u-label mb-1">Type</dt>
              <dd className="text-sm text-ink">{info.kind}</dd>
            </div>
            <div>
              <dt className="u-label mb-1">Would live</dt>
              <dd className="text-sm text-ink">{info.lives}</dd>
            </div>
            {info.draft ? (
              <div>
                <dt className="u-label mb-1">Copy</dt>
                <dd className="text-sm text-ink">Draft, needs your edit</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Container>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
