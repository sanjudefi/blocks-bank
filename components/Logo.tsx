import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'icon' | 'full'   // icon = cube only, full = cube + text
  size?: 'sm' | 'md' | 'lg' | 'xl'
  href?: string | null         // pass null to render without link
  className?: string
}

const SIZES = {
  sm:  { icon: 28,  full: { w: 120, h: 36  } },
  md:  { icon: 36,  full: { w: 160, h: 48  } },
  lg:  { icon: 48,  full: { w: 220, h: 66  } },
  xl:  { icon: 80,  full: { w: 320, h: 96  } },
}

export default function Logo({ variant = 'full', size = 'md', href = '/', className = '' }: LogoProps) {
  const dim = SIZES[size]

  const img =
    variant === 'icon' ? (
      <Image
        src="/logo-icon.svg"
        alt="Blocks Bank"
        width={dim.icon}
        height={dim.icon}
        priority
        className={className}
      />
    ) : (
      <Image
        src="/logo-full.svg"
        alt="Blocks Bank"
        width={dim.full.w}
        height={dim.full.h}
        priority
        className={className}
      />
    )

  if (href === null) return img
  return <Link href={href}>{img}</Link>
}
