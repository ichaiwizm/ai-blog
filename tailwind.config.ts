import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Space Grotesk", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["Space Mono", "Consolas", "monospace"],
      },
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          inverse: "var(--bg-inverse)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          light: "var(--accent-light)",
          medium: "var(--accent-medium)",
        },
        support: {
          orange: "var(--support-orange)",
          warm: "var(--support-warm)",
          cream: "var(--support-cream)",
        },
        text: {
          primary: "var(--text-primary)",
          body: "var(--text-body)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        border: {
          DEFAULT: "var(--border)",
          light: "var(--border-light)",
          medium: "var(--border-medium)",
        },
      },
      borderWidth: {
        "3": "3px",
      },
      boxShadow: {
        lift: "0 8px 24px rgba(26, 26, 29, 0.08)",
        float: "0 12px 40px rgba(26, 26, 29, 0.12)",
        editorial: "12px 12px 0 var(--border)",
        accent: "8px 8px 0 var(--accent)",
        brutal: "6px 6px 0 var(--border)",
        "brutal-accent": "6px 6px 0 var(--accent)",
        "brutal-hover": "8px 8px 0 var(--accent)",
        "brutal-sm": "4px 4px 0 var(--border)",
        "brutal-sm-accent": "4px 4px 0 var(--accent)",
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
        "slide-left": "slide-in-left 0.4s ease forwards",
        "scale-up": "scale-up 0.3s ease forwards",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "var(--text-body)",
            a: {
              color: "var(--accent)",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              textDecorationThickness: "2px",
              "&:hover": {
                textDecorationColor: "transparent",
              },
            },
            h1: {
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: "600",
              letterSpacing: "-0.04em",
              lineHeight: "0.95",
            },
            h2: {
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: "500",
              letterSpacing: "-0.03em",
              lineHeight: "1.05",
              marginTop: "3rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--border-light)",
            },
            h3: {
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: "500",
              letterSpacing: "-0.02em",
              lineHeight: "1.15",
              marginTop: "2.5rem",
            },
            h4: {
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: "600",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            },
            blockquote: {
              borderLeftWidth: "4px",
              borderLeftColor: "var(--accent)",
              backgroundColor: "var(--accent-light)",
              padding: "1.25rem 1.5rem",
              fontStyle: "normal",
            },
            code: {
              fontFamily: "Space Mono, Consolas, monospace",
              backgroundColor: "var(--bg-tertiary)",
              padding: "0.2em 0.5em",
              borderRadius: "0",
              border: "1px solid var(--border-light)",
              color: "var(--accent)",
              fontWeight: "400",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
            pre: {
              fontFamily: "Space Mono, Consolas, monospace",
              backgroundColor: "var(--bg-inverse)",
              border: "2px solid var(--border)",
              borderRadius: "0",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
