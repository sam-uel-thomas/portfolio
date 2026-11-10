import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import ServicesSpotlight from "@/components/ServicesSpotlight";
import { services } from "@/content/site";

export default function Services() {
  return (
    <Section id="services">
      <SectionHead
        label="Services"
        title="From first sketch to *shipped*."
      />
      <ServicesSpotlight services={services} />
    </Section>
  );
}
