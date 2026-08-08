import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import Grain from "@/components/Grain";
import GridLines from "@/components/GridLines";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Testimonials from "@/components/Testimonials";
import Work from "@/components/Work";
import { marqueeItems, motion } from "@/content/site";

export default function Home() {
  return (
    <>
      <GridLines />
      <Grain />
      <Header />
      {/* Content sits above the fixed footer and occludes it while scrolling. */}
      <div className="relative z-10 bg-paper">
        <main id="main">
          <Hero />
          <Work />
          {motion.marquee ? <Marquee items={marqueeItems} /> : null}
          <Testimonials />
          <About />
          <Contact />
        </main>
      </div>
      <FooterReveal>
        <Footer />
      </FooterReveal>
    </>
  );
}
