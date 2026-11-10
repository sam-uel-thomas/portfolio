import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import WorkIndex from "@/components/WorkIndex";
import { projects } from "@/content/site";

export default function Work() {
  return (
    <Section id="work">
      <SectionHead
        label="Work"
        title="Selected *works*."
      />
      <WorkIndex projects={projects} />
    </Section>
  );
}
