import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Refurzy — Demo',
  description: 'Refurzy recruitment platform demo',
  icons: { icon: '/assets/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-navy-dark text-white antialiased">{children}</body>
    </html>
  )
}
