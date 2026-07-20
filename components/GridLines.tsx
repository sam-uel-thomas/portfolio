import Container from "@/components/Container";

/**
 * Faint fixed column rules that run the full height of the page — the visible
 * skeleton of the 12-column grid everything else snaps to. Purely decorative.
 */
export default function GridLines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
    >
      <Container className="h-full">
        <div className="grid h-full grid-cols-12 border-x border-ink/[0.05]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-l border-ink/[0.05] first:border-l-0" />
          ))}
        </div>
      </Container>
    </div>
  );
}
