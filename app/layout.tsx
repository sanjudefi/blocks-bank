import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blocks Bank – Tokenized Financial Infrastructure',
  description:
    'Blocks Bank is an open infrastructure platform that enables financial institutions to issue tokenized financial instruments such as bonds, funds, and real estate assets.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
