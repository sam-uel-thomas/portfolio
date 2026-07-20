import Container from "@/components/Container";

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
  return (
    <section
      id={id}
      className={`relative ${toneClasses[tone]} py-24 md:py-32 ${className}`.trim()}
    >
      <Container>{children}</Container>
    </section>
  );
}
