import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0f0a2e', light: '#1a1145', dark: '#0a0720' },
        purple: { DEFAULT: '#6c3ce0', light: '#8b5cf6', dark: '#4c1d95' },
        cyan: { DEFAULT: '#00e5c7', light: '#5eead4', dark: '#0d9488' },
        orange: { DEFAULT: '#f59e0b', light: '#fbbf24' },
      },
    },
  },
  plugins: [],
}
export default config
