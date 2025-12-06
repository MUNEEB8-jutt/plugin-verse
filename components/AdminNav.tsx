'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminNav() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/plugins', label: 'Plugins', icon: '🔌' },
    { href: '/admin/requests', label: 'Requests', icon: '📝' },
    { href: '/admin/deposits', label: 'Deposits', icon: '💰' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-full lg:w-64 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 lg:sticky lg:top-20 lg:h-fit">
      <h2 className="text-lg font-bold text-emerald-400 mb-4 hidden lg:block">Admin Panel</h2>
      <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-center lg:justify-start gap-2 px-4 py-3 rounded-xl transition-all text-sm font-medium ${pathname === link.href
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent'
              }`}
          >
            <span className="text-lg">{link.icon}</span>
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Return to Dashboard Button */}
      <Link
        href="/"
        className="mt-4 flex items-center justify-center lg:justify-start gap-2 px-4 py-3 rounded-xl transition-all text-sm font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
      >
        <span className="text-lg">🏠</span>
        <span className="hidden sm:inline">Return to Site</span>
      </Link>
    </aside>
  )
}
