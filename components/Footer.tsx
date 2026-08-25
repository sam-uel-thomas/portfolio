import Container from "@/components/Container";
import LocalTime from "@/components/LocalTime";
import Magnetic from "@/components/Magnetic";
import { site, socials } from "@/content/site";

const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-4 gap-y-9 md:grid-cols-12 md:gap-x-5 md:gap-y-12">
          {/* Colophon */}
          <div className="col-span-4 md:col-span-5">
            <p className="u-label text-paper/40">{site.role}</p>
            <a
              href={`mailto:${site.email}`}
              className="u-underline mt-4 inline-block text-lg text-paper"
            >
              {site.email}
            </a>
          </div>

          {/* Index */}
          <nav className="col-span-2 md:col-span-2 md:col-start-7">
            <p className="u-label mb-4 text-paper/40">Index</p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="u-underline text-sm text-paper"
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
                    className="u-underline text-sm text-paper"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to top */}
          <div className="col-span-4 md:col-span-2 md:col-start-11 md:text-right">
            <Magnetic strength={0.3} className="inline-block">
              <a
                href="#top"
                className="group u-label inline-flex items-center gap-2 text-paper/60 transition-colors duration-300 hover:text-paper"
              >
                Back to the top
                <span className="transition-transform duration-500 ease-editorial group-hover:-translate-y-1">
                  ↑
                </span>
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Oversized wordmark — the last thing the page says. Set to fill the
            measure so it reads as a mark rather than a heading.

            Sized in `cqw`, not `vw`: the Container caps at 1680px and carries
            side padding, so viewport units kept growing after the box stopped.
            Past ~2000px the line outgrew its measure, and because a centred
            nowrap line pins to the start edge, the whole overflow ran off to
            the right. Container units track the box itself, so it fills the
            measure at every width and can't outrun it. */}
        <a
          href="#top"
          aria-label="Back to the top"
          className="mt-16 block [container-type:inline-size] md:mt-24"
        >
          <span className="block whitespace-nowrap text-center font-sans text-[17cqw] font-bold leading-[0.8] tracking-tightest text-paper transition-opacity duration-500 ease-editorial hover:opacity-70">
            {site.name}
          </span>
        </a>

        {/* Bottom bar */}
        <div className="mt-10 grid grid-cols-4 gap-y-2 border-t border-paper/15 pt-6 md:grid-cols-12">
          <span className="u-label col-span-2 text-paper/50 md:col-span-4">
            © {new Date().getFullYear()} {site.name}
          </span>
          <LocalTime className="u-label col-span-4 hidden text-center text-paper/50 md:block" />
          <span className="u-label col-span-2 text-right text-paper/50 md:col-span-4">
            {site.location}
          </span>
        </div>
      </Container>
    </footer>
  );
}
