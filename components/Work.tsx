import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import WorkLead from "@/components/WorkLead";
import { projects } from "@/content/site";

/**
 * The work, ranked: the project with a case study leads, with its story and
 * numbers beside one picture, and the rest follow as a compact list.
 *
 * The page's dark section. The screenshots carry the colour, and on ink they
 * read like work on a gallery wall, between the light hero and the light
 * About panel that's laid over its end.
 *
 * No big headline here, unlike the other sections: the lead project's name is
 * the big type, so the section opens straight onto the work.
 */
export default function Work() {
  return (
    <Section id="work" tone="ink">
      <SectionHead label="Selected work" dark />
      <WorkLead projects={projects} tone="dark" />
    </Section>
  );
}
