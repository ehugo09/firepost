import type { Config } from "tailwindcss";

const baseColors = {
  background: {
    light: "0 0% 100%",
    dark: "222.2 84% 4.9%",
  },
  foreground: {
    light: "222.2 84% 4.9%",
    dark: "210 40% 98%",
  },
  primary: {
    DEFAULT: "#2ECC71",
    foreground: "#FFFFFF",
  },
  secondary: {
    DEFAULT: "#E2E8F0",
    foreground: "#1E293B",
  },
  accent: {
    DEFAULT: "#E86643",
    foreground: "#FFFFFF",
  },
  muted: {
    DEFAULT: "#F1F5F9",
    foreground: "#64748B",
  },
  destructive: {
    DEFAULT: "0 84.2% 60.2%",
    foreground: "210 40% 98%",
  },
};

const colors = {
  ...baseColors,
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
};

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors,
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.625rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;