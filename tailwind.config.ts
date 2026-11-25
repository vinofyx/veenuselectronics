import type { Config } from "tailwindcss";

/**
 * Veenus Electronics design tokens.
 * Brand palette: navy #102D4F, deep navy #091D33, blue #1C4775, orange #FF841F,
 * light background #F4F7FB, text #142E4C, muted #64758B.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Fluid width up to 1440px; side padding is set in globals.css (.container).
    container: {
      center: true,
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#102D4F",
          50: "#F4F7FB",
          100: "#E3EAF3",
          200: "#C5D3E4",
          300: "#98B0CD",
          400: "#6488B2",
          500: "#2F5C8E",
          600: "#1C4775", // blue
          700: "#163B63",
          800: "#102D4F", // navy
          900: "#091D33", // deep navy
          950: "#061423",
        },
        accent: {
          DEFAULT: "#FF841F",
          50: "#FFF6EE",
          100: "#FFEAD7",
          200: "#FFD2AD",
          300: "#FFB577",
          400: "#FF9C47",
          500: "#FF841F",
          // 600+ are darkened so orange text passes WCAG AA (4.5:1) on white and #F4F7FB.
          600: "#B65200",
          700: "#9A4508",
          800: "#7C3A0B",
          900: "#7C3A0B",
        },
        surface: "#FFFFFF",
        page: "#F4F7FB",
        ink: { DEFAULT: "#142E4C", muted: "#5B6B80" }, // muted darkened from #64758B for AA contrast on #F4F7FB
        // Buttons use 700/800: white text on the bright #25D366 is only 2:1 contrast.
        whatsapp: { DEFAULT: "#25D366", 600: "#1FB959", 700: "#0F7A40", 800: "#0B6634" },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.25rem, 1.4rem + 3.2vw, 3.75rem)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(1.9rem, 1.3rem + 2.2vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.6rem, 1.2rem + 1.4vw, 2.375rem)", { lineHeight: "1.15", letterSpacing: "-0.018em" }],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(9,29,51,0.05)",
        card: "0 1px 2px rgba(9,29,51,0.04), 0 4px 16px -6px rgba(9,29,51,0.08)",
        "card-hover": "0 2px 4px rgba(9,29,51,0.04), 0 18px 36px -12px rgba(9,29,51,0.18)",
        float: "0 24px 48px -16px rgba(9,29,51,0.35)",
        header: "0 1px 0 rgba(9,29,51,0.06), 0 6px 24px -12px rgba(9,29,51,0.12)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-down": { from: { opacity: "0", transform: "translateY(-4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-in": { from: { opacity: "0", transform: "translateX(16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
      },
      animation: {
        "fade-down": "fade-down 160ms ease-out",
        "slide-in": "slide-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
