import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import Intro from "@/components/Intro";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

/**
 * The only web font on the site, and it earns its place: one weight, used
 * italic, for accented words. Helvetica carries everything else at zero cost.
 */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  // The site answers on both the apex and www. Without this, search engines
  // see two hosts serving identical content and pick a winner themselves;
  // resolved against metadataBase, it names the production domain as the one
  // that counts.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the script below writes a class onto <html>
    // before React hydrates, so the server and client markup deliberately
    // differ here. Without this React reconciles the class straight back off
    // again and every reveal on the page stops animating.
    <html lang="en" className={display.variable} suppressHydrationWarning>
      <body>
        {/*
          Marks the document as scripted before anything below it paints. The
          type reveals keep their words hidden only under `.js`, so a visitor
          without JavaScript gets plain, readable text instead of a blank page.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <Intro>
          <SmoothScroll>{children}</SmoothScroll>
        </Intro>
      </body>
    </html>
  );
}
