import Container from "@/components/Container";
import LocalTime from "@/components/LocalTime";
import Magnetic from "@/components/Magnetic";
import SectionLink from "@/components/SectionLink";
import SpringyWordmark from "@/components/SpringyWordmark";
import { site, socials } from "@/content/site";

// Home page sections, in page order. SectionLink gets to them from any page.
// No Contact: this footer is the contact.
const nav = [
  { label: "Work", section: "work" },
  { label: "About", section: "about" },
];

// The CV only shows once there's a file to link to.
const elsewhere = [
  ...socials.map((social) => ({ label: social.label, href: social.href })),
  ...(site.cv ? [{ label: "CV", href: site.cv }] : []),
];

/**
 * The end of every page, and the contact. It used to follow a Contact
 * section that said the same thing, with the same address, a few hundred
 * pixels earlier; now it's said once, here.
 */
export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-4 gap-y-10 md:grid-cols-12 md:gap-x-5">
          {/* What you're open to, then the address, at a size that makes it
              the obvious thing to do next. */}
          <div className="col-span-4 md:col-span-7">
            <h2 className="sr-only">Contact</h2>
            <p className="flex items-baseline gap-2.5 text-sm leading-snug text-paper/70">
              {site.available ? (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 -translate-y-px rounded-full bg-accent"
                />
              ) : null}
              {site.openTo}
            </p>
            <Magnetic strength={0.18} padding={20} className="mt-5 inline-block max-w-full">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex max-w-full items-baseline gap-3 break-words font-sans text-[clamp(1.1rem,5.4vw,1.75rem)] font-bold leading-[1.05] tracking-tight text-paper md:text-[clamp(1.5rem,3.1vw,3.25rem)]"
              >
                <span className="u-underline pb-1">{site.email}</span>
                <span
                  aria-hidden="true"
                  className="text-lg transition-transform duration-500 ease-editorial group-hover:translate-x-1 md:text-2xl"
                >
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>

          {/* Index */}
          <nav aria-label="Sections" className="col-span-2 md:col-span-2 md:col-start-9">
            <p className="u-label mb-4 text-paper/60">Index</p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.section}>
                  <SectionLink
                    section={item.section}
                    className="u-underline text-sm text-paper"
                  >
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere */}
          <div className="col-span-2 md:col-span-2">
            <p className="u-label mb-4 text-paper/60">Elsewhere</p>
            <ul className="space-y-2.5">
              {elsewhere.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-underline text-sm text-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized wordmark — the last thing the page says. Set to fill the
            measure so it reads as a mark rather than a heading.

            Sized in `cqw`, not `vw`: the Container caps at 1680px and carries
            side padding, so viewport units kept growing after the box stopped.
            Past ~2000px the line outgrew its measure, and because a centred
            nowrap line pins to the start edge, the whole overflow ran off to
            the right. Container units track the box itself, so it fills the
            measure at every width and can't outrun it.

            The letters rise out of a mask once the footer is uncovered and
            hop under the cursor. The row carries 0.3em of headroom above the
            letters for those hops, so the margin here is trimmed to match. */}
        <a
          href="#top"
          aria-label="Back to the top"
          className="mt-10 block text-paper md:mt-8"
        >
          <SpringyWordmark text={site.name} />
        </a>

        {/* Bottom bar. The local time already says where you are, so the
            right-hand slot holds the way back up instead. */}
        <div className="mt-10 grid grid-cols-4 items-baseline gap-y-2 border-t border-paper/15 pt-6 md:grid-cols-12">
          <span className="u-label col-span-2 text-paper/50 md:col-span-4">
            © {new Date().getFullYear()} {site.name}
          </span>
          <LocalTime className="u-label col-span-4 hidden text-center text-paper/50 md:block" />
          <div className="col-span-2 text-right md:col-span-4">
            <Magnetic strength={0.3} className="inline-block">
              <a
                href="#top"
                className="group u-label inline-flex items-center gap-2 text-paper/60 transition-colors duration-300 hover:text-paper"
              >
                Back to the top
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-editorial group-hover:-translate-y-1"
                >
                  ↑
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </Container>
    </footer>
  );
}
