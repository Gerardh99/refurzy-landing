import type { Metadata } from 'next'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

export const metadata: Metadata = {
  title: 'Refurzy — Demo',
  description: 'Refurzy recruitment platform demo',
  icons: { icon: '/assets/refurzy-favicon.jpg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-[#FAFBFE] text-slate-800 antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
