import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import Grain from "@/components/Grain";
import GridLines from "@/components/GridLines";
import Header from "@/components/Header";

/**
 * The frame every page sits in: grid rules, grain, the header, and the footer
 * waiting underneath. Shared so a case study page is unmistakably the same
 * site as the home page, not a cousin of it.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GridLines />
      <Grain />
      <Header />
      {/* Content sits above the fixed footer and occludes it while scrolling. */}
      <div className="relative z-10 bg-paper">
        <main id="main">{children}</main>
      </div>
      <FooterReveal>
        <Footer />
      </FooterReveal>
    </>
  );
}
