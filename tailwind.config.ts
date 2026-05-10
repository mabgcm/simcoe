import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#C0392B",
          foreground: "#FFFFFF",
          dark: "#922B21",
          light: "#F1948A"
        },
        secondary: {
          DEFAULT: "#1A1A2E",
          foreground: "#FFFFFF"
        },
        accent: {
          DEFAULT: "#F39C12",
          foreground: "#1A1A2E"
        },
        muted: {
          DEFAULT: "#F2F4F7",
          foreground: "#667085"
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2C3E50"
        }
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"]
      },
      boxShadow: {
        soft: "0 12px 30px rgba(26, 26, 46, 0.08)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
