import About from "@/components/About";
import Hero from "@/components/Hero";
import PageShell from "@/components/PageShell";
import Testimonials from "@/components/Testimonials";
import Work from "@/components/Work";

// Services is off the page for now: it was written for freelance clients, and
// the site is aimed at engineering roles. components/Services.tsx still works;
// put <Services /> back after <About /> to bring it back.
export default function Home() {
  return (
    <PageShell>
      <Hero />
      <Work />
      <Testimonials />
      {/* Getting in touch is the footer's job, on every page. */}
      <About />
    </PageShell>
  );
}
