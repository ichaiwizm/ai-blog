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
        display: ["Fraunces", "Crimson Pro", "Georgia", "serif"],
        body: ["Outfit", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
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
        soft: "0 4px 20px rgba(0, 0, 0, 0.08)",
        medium: "0 8px 30px rgba(0, 0, 0, 0.12)",
        large: "0 20px 50px rgba(0, 0, 0, 0.15)",
        glow: "0 0 40px rgba(212, 87, 59, 0.2)",
        "glow-hover": "0 0 60px rgba(212, 87, 59, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-warm": "linear-gradient(135deg, #FAF8F5 0%, #FFF5ED 100%)",
        "gradient-dark": "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-left": "slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-up": "scale-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
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
              fontFamily: "Fraunces, Crimson Pro, Georgia, serif",
              fontWeight: "600",
              letterSpacing: "-0.03em",
            },
            h2: {
              fontFamily: "Fraunces, Crimson Pro, Georgia, serif",
              fontWeight: "500",
              letterSpacing: "-0.02em",
              marginTop: "3rem",
              paddingBottom: "1rem",
            },
            h3: {
              fontFamily: "Fraunces, Crimson Pro, Georgia, serif",
              fontWeight: "500",
              marginTop: "2.5rem",
            },
            h4: {
              fontFamily: "Outfit, sans-serif",
              fontWeight: "600",
            },
            blockquote: {
              borderLeftWidth: "0",
              borderLeftColor: "transparent",
              backgroundColor: "var(--accent-light)",
              padding: "1.5rem 2rem",
              fontStyle: "italic",
              borderRadius: "12px",
              position: "relative",
            },
            code: {
              fontFamily: "Space Mono, Consolas, monospace",
              backgroundColor: "var(--bg-tertiary)",
              padding: "0.2em 0.5em",
              borderRadius: "6px",
              fontSize: "0.9em",
              color: "var(--accent)",
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
              borderRadius: "12px",
              padding: "1.5rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
