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
      },
    },
  },
  plugins: [],
}
export default config
