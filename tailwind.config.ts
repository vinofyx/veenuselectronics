import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", lg: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#12345A",
          50: "#EEF3F9",
          100: "#D6E1EE",
          200: "#A9BFDA",
          600: "#1A4677",
          700: "#12345A",
          800: "#0D2744",
          900: "#081A2E",
        },
        accent: { DEFAULT: "#F58220", 50: "#FFF4EA", 600: "#DE6F10", 700: "#B85A0B" },
        surface: "#F7F9FC",
        ink: "#182433",
        whatsapp: { DEFAULT: "#25D366", 700: "#128C4A" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,52,90,0.06), 0 4px 16px rgba(18,52,90,0.06)",
        "card-hover": "0 2px 4px rgba(18,52,90,0.08), 0 12px 32px rgba(18,52,90,0.12)",
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
};

export default config;
