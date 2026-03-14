import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Blocks Bank – Tokenized Financial Infrastructure',
  description:
    'Open infrastructure platform for financial institutions to issue tokenized bonds, funds, and real estate assets on blockchain.',
  icons: {
    icon: '/logo-icon.svg',
    shortcut: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  metadataBase: new URL('https://blocksbank.catchway.info'),
  openGraph: {
    title: 'Blocks Bank – Tokenize Financial Assets in Hours',
    description: 'Complete infrastructure for banks and funds to issue tokenized bonds, deposits, real estate and fund shares with built-in KYC.',
    siteName: 'Blocks Bank by Catchway',
    images: [{ url: '/logo-full.svg', width: 340, height: 120, alt: 'Blocks Bank' }],
  },
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
