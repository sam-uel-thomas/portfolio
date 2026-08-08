import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.role}`;

/**
 * The link preview: the hero, restated at card proportions. Generated at build
 * time so it stays in step with content/site.ts instead of drifting away as a
 * stale PNG somebody has to remember to re-export.
 */
export default function OpengraphImage() {
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
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#6b6b6b",
          }}
        >
          <span>{site.role}</span>
          <span>{site.location}</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 168,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            color: "#111111",
          }}
        >
          {site.name}
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
          <span>{site.email}</span>
          {site.available ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 22,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#6b6b6b",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#01B000",
                }}
              />
              {site.availabilityLabel}
            </span>
          ) : null}
        </div>
      </div>
    ),
    size
  );
}
