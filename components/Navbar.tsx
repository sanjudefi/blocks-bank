'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Mail, Phone } from 'lucide-react'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '#problem',      label: 'Problem' },
  { href: '#solution',     label: 'Solution' },
  { href: '#features',     label: 'Features' },
  { href: '#kyc',          label: 'KYC' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#contact',      label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top micro-bar */}
      <div className="hidden sm:flex items-center justify-end gap-6 bg-slate-950 px-6 py-1.5 text-[11px] text-slate-400">
        <a href="mailto:ceo@catchway.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
          <Mail className="w-3 h-3" /> ceo@catchway.com
        </a>
        <a href="tel:+14372473222" className="flex items-center gap-1.5 hover:text-white transition-colors">
          <Phone className="w-3 h-3" /> +1 (437) 247-3222
        </a>
        <span className="text-slate-600">·</span>
        <span>Ontario, Canada</span>
      </div>

      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo-full.svg" alt="Blocks Bank" width={150} height={45} priority className="h-10 w-auto" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors font-medium">
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-2.5">
              <Link href="/signup">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm transition-all hover:shadow-blue-500/30 hover:shadow-md">
                  Get Started →
                </button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
            <div className="pb-3 mb-2 border-b border-border">
              <Image src="/logo-full.svg" alt="Blocks Bank" width={130} height={40} className="h-9 w-auto" />
            </div>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors font-medium">
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border mt-3 flex gap-2">
              <Link href="/signup" className="flex-1" onClick={() => setOpen(false)}>
                <button className="w-full py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent/50 transition-colors">Sign In</button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setOpen(false)}>
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold">Get Started</button>
              </Link>
            </div>
            <div className="pt-2 space-y-1">
              <a href="mailto:ceo@catchway.com" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-3.5 h-3.5" /> ceo@catchway.com
              </a>
              <a href="tel:+14372473222" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-3.5 h-3.5" /> +1 (437) 247-3222
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
