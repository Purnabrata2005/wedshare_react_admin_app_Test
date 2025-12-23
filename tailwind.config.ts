import type { Config } from "tailwindcss"

/**
 * Tailwind v4 Configuration
 * 
 * Note: Most configuration is now handled in src/index.css:
 * - Colors: defined via @theme inline { --color-* }
 * - Dark mode: configured via @custom-variant dark
 * - Plugins: loaded via @plugin directive
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,vue}"],
}

export default config
