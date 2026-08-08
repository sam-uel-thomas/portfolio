import Container from "@/components/Container";
import { InvertedGridLines } from "@/components/GridLines";

type Tone = "paper" | "canvas" | "ink";

type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Background register. "ink" inverts to a dark, text-paper spotlight. */
  tone?: Tone;
};

const toneClasses: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  canvas: "bg-canvas text-ink",
  ink: "bg-ink text-paper",
};

/** Editorial section shell: generous rhythm, grid measure, structural top rule. */
export default function Section({
  id,
  children,
  className = "",
  tone = "paper",
}: SectionProps) {
  const inverted = tone === "ink";

  return (
    <section
      id={id}
      className={`relative ${toneClasses[tone]} py-24 md:py-32 ${
        // Softened top corners read as a panel laid over the page rather than a
        // band cut out of it — the one place the site isn't perfectly square.
        inverted ? "rounded-t-[1.75rem] md:rounded-t-[2.5rem]" : ""
      } ${className}`.trim()}
    >
      {inverted ? <InvertedGridLines /> : null}
      <Container className="relative">{children}</Container>
    </section>
  );
}
