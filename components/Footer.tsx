import Container from "@/components/Container";
import { site, socials } from "@/content/site";

const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="py-12 md:py-20">
        <div className="grid grid-cols-4 gap-y-9 md:grid-cols-12 md:gap-x-5 md:gap-y-12">
          {/* Wordmark + colophon */}
          <div className="col-span-4 md:col-span-5">
            <a
              href="#top"
              className="font-sans text-3xl font-bold tracking-tight text-paper transition-opacity duration-300 hover:opacity-60 sm:text-4xl md:text-5xl"
            >
              {site.name}
            </a>
            <p className="u-label mt-5 max-w-xs leading-relaxed text-paper/40">
              {site.role}
            </p>
          </div>

          {/* Index */}
          <nav className="col-span-2 md:col-span-2 md:col-start-7">
            <p className="u-label mb-4 text-paper/40">Index</p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-paper transition-opacity duration-300 hover:opacity-60"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere */}
          <div className="col-span-2 md:col-span-2">
            <p className="u-label mb-4 text-paper/40">Elsewhere</p>
            <ul className="space-y-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-paper transition-opacity duration-300 hover:opacity-60"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to top */}
          <div className="col-span-4 md:col-span-2 md:col-start-11 md:text-right">
            <a
              href="#top"
              className="group u-label inline-flex items-center gap-2 text-paper/60 transition-colors duration-300 hover:text-paper"
            >
              Back to top
              <span className="transition-transform duration-300 ease-editorial group-hover:-translate-y-1">
                ↑
              </span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 grid grid-cols-4 gap-y-2 border-t border-paper/15 pt-6 md:mt-24 md:grid-cols-8">
          <span className="u-label col-span-2 text-paper/50 md:col-span-4">
            © 2026 {site.name}
          </span>
          <span className="u-label col-span-2 text-right text-paper/50 md:col-span-4 md:text-right">
            {site.location}
          </span>
        </div>
      </Container>
    </footer>
  );
}
