import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHead from "@/components/SectionHead";
import { GitHubIcon, LinkedInIcon } from "@/components/SocialIcons";
import { site, socials } from "@/content/site";

const iconFor: Record<string, (props: { className?: string }) => JSX.Element> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
};

export default function Contact() {
  return (
    <Section id="contact">
      <SectionHead
        label="Contact"
        title="Let’s make something considered."
        titleSpan="lg:col-span-8"
      />

      <div className="grid grid-cols-4 gap-y-14 md:grid-cols-12 md:gap-x-5">
        {/* Email */}
        <div className="col-span-4 md:col-span-8">
          <Reveal>
            <p className="u-label mb-6">(Email)</p>
          </Reveal>
          <Reveal delay={100}>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex max-w-full items-baseline gap-3 break-words font-sans text-[clamp(1.5rem,5.5vw,4.5rem)] font-bold leading-[0.95] tracking-tightest text-ink"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_2px]">
                {site.email}
              </span>
              <span
                aria-hidden="true"
                className="text-2xl transition-transform duration-500 ease-editorial group-hover:translate-x-1 sm:text-3xl"
              >
                ↗
              </span>
            </a>
          </Reveal>
        </div>

        {/* Elsewhere */}
        <div className="col-span-4 md:col-span-3 md:col-start-10">
          <Reveal delay={160}>
            <p className="u-label mb-2 border-t border-ink/15 pt-5">Elsewhere</p>
            <ul>
              {socials.map((social) => {
                const Icon = iconFor[social.label];
                return (
                  <li key={social.label} className="border-b border-line">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group flex items-center justify-between py-4 transition-colors duration-300"
                    >
                      <span className="flex items-center gap-3">
                        {Icon ? (
                          <Icon className="h-4 w-4 text-ink" />
                        ) : null}
                        <span className="text-lg text-ink">{social.label}</span>
                      </span>
                      <span className="u-label text-muted transition-colors duration-300 group-hover:text-ink">
                        ↗
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
