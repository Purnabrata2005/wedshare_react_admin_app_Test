import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        wedshare: {
          light: {
            bg: "#F8FAFC",
            surface: "#FFFFFF",
            primary: "#E11D48",
            secondary: "#F43F5E",
            text: {
              primary: "#111827",
              secondary: "#4B5563",
            },
            success: "#16A34A",
            warning: "#F59E0B",
            error: "#EF4444",
          },
          dark: {
            bg: "#0F172A",
            surface: "#020617",
            primary: "#F43F5E",
            secondary: "#FB7185",
            text: {
              primary: "#F8FAFC",
              secondary: "#CBD5E1",
            },
            success: "#22C55E",
            warning: "#FB5B24",
            error: "#EF4444",
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
