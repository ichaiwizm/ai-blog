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
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
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
          dark: "var(--accent-dark)",
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
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "soft-md": "0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.1)",
        "soft-xl": "0 16px 48px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.12)",
        "glow": "0 0 20px rgba(124, 58, 237, 0.15), 0 0 40px rgba(124, 58, 237, 0.1)",
        "glow-hover": "0 0 30px rgba(124, 58, 237, 0.2), 0 0 60px rgba(124, 58, 237, 0.15)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "var(--text-body)",
            lineHeight: "1.8",
            a: {
              color: "var(--accent)",
              textDecoration: "none",
              borderBottom: "1px solid var(--accent-light)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderBottomColor: "var(--accent)",
                color: "var(--accent-hover)",
              },
            },
            h1: {
              fontFamily: "Playfair Display, Georgia, serif",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
            },
            h2: {
              fontFamily: "Playfair Display, Georgia, serif",
              fontWeight: "700",
              letterSpacing: "-0.01em",
              lineHeight: "1.3",
              marginTop: "2.5em",
              marginBottom: "1em",
            },
            h3: {
              fontFamily: "Playfair Display, Georgia, serif",
              fontWeight: "600",
              marginTop: "2em",
              lineHeight: "1.4",
            },
            h4: {
              fontFamily: "Inter, sans-serif",
              fontWeight: "600",
              letterSpacing: "-0.01em",
            },
            p: {
              marginTop: "1.5em",
              marginBottom: "1.5em",
            },
            blockquote: {
              borderLeftWidth: "3px",
              borderLeftColor: "var(--accent)",
              backgroundColor: "var(--accent-light)",
              padding: "1.5rem 2rem",
              fontStyle: "italic",
              borderRadius: "0.5rem",
              fontSize: "1.05em",
            },
            code: {
              fontFamily: "JetBrains Mono, Consolas, monospace",
              backgroundColor: "var(--bg-tertiary)",
              padding: "0.25em 0.5em",
              borderRadius: "0.375rem",
              color: "var(--accent)",
              fontSize: "0.9em",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
            pre: {
              fontFamily: "JetBrains Mono, Consolas, monospace",
              backgroundColor: "var(--bg-inverse)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              border: "1px solid var(--border-light)",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
