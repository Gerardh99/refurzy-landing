import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1A0F5D', light: '#231470', dark: '#130B45' },
        purple: { DEFAULT: '#6D40F9', light: '#8B5CF6', dark: '#4c1d95' },
        cyan: { DEFAULT: '#14CDD3', light: '#06BAFF', dark: '#0d9488' },
        orange: { DEFAULT: '#f59e0b', light: '#fbbf24' },
        // Light theme
        surface: { DEFAULT: '#FAFBFE', card: '#FFFFFF', muted: '#F3F4F8', border: '#E5E7EB' },
        ink: { DEFAULT: '#1E293B', light: '#64748B', muted: '#94A3B8', faint: '#CBD5E1' },
      },
    },
  },
  plugins: [],
}
export default config
