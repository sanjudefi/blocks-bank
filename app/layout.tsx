import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Blocks Bank – Tokenized Financial Infrastructure',
  description:
    'Open infrastructure platform for financial institutions to issue tokenized bonds, funds, and real estate assets on blockchain.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
