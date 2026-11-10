import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Work from "@/components/Work";
import { marqueeItems, motion } from "@/content/site";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <Work />
      {motion.marquee ? <Marquee items={marqueeItems} /> : null}
      <Services />
      <Testimonials />
      <About />
      <Contact />
    </PageShell>
  );
}
