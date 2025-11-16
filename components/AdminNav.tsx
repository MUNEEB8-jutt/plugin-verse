'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/helpers'

export function AdminNav() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/plugins', label: 'Plugins', icon: '🔌' },
    { href: '/admin/deposits', label: 'Deposits', icon: '💰' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 glass rounded-lg p-4 h-fit sticky top-20">
      <h2 className="text-xl font-bold text-accent-primary mb-4">Admin Panel</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded transition-all',
              pathname === link.href
                ? 'bg-accent-primary text-bg-primary font-semibold'
                : 'text-text-primary hover:bg-bg-secondary'
            )}
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
