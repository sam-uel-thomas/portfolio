import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#ffffff",
        muted: "#6b6b6b",
        line: "#e6e6e6",
        canvas: "#f6f4f0",
        accent: "#01B000",
      },
      fontFamily: {
        // Helvetica everywhere — the Swiss grotesk. Falls back to Arial off-Mac.
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        // The accent voice: a high-contrast display serif, used italic and
        // sparingly. Loaded via next/font in app/layout.tsx.
        display: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
        mono: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        editorial: "72rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        "1200": "1200ms",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scrollcue: {
          "0%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(200%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        scrollcue: "scrollcue 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
