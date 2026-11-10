import { ImageResponse } from "next/og";
import { projects, site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Case study — ${site.name}`;

/**
 * The link preview for a case study: the site's card, with the project's name
 * where the home page card has yours. Drawn rather than borrowed from the
 * project screenshot, because those are WebP and not every platform that
 * unfurls links will show one.
 */
export default function OpengraphImage({ params }: { params: { slug: string } }) {
  const project = projects.find((item) => item.caseStudy?.slug === params.slug);
  const title = project?.title ?? site.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "64px 72px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#6b6b6b",
          }}
        >
          <span>Case study</span>
          <span>{project?.role ?? site.role}</span>
        </div>

        <div
          style={{
            display: "flex",
            // Long project names step down so they stay on one line.
            fontSize: title.length > 9 ? 120 : 168,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            color: "#111111",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #e6e6e6",
            paddingTop: 28,
            fontSize: 26,
            color: "#111111",
          }}
        >
          <span>{site.name}</span>
          <span
            style={{
              fontSize: 22,
              color: "#6b6b6b",
            }}
          >
            {site.role}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
