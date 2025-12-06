'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavbarProps {
  user?: any
  isAdmin?: boolean
}

export function Navbar({ user, isAdmin }: NavbarProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/logo.png`}
              alt="PluginVerse"
              className="w-9 h-9 object-contain rounded-lg"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              PluginVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link 
              href="/" 
              prefetch={true}
              className="group px-4 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 flex items-center gap-2"
            >
              <span className="group-hover:scale-110 transition-transform">🔍</span> Explore Plugins
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/account" 
                  prefetch={true}
                  className="group px-4 py-2 text-sm font-medium bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl transition-all border border-slate-600/50 flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">🎮</span> My Plugins
                </Link>
                <Link 
                  href="/deposit" 
                  prefetch={true}
                  className="group px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">💰</span> Coins
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="group px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                  >
                    <span className="group-hover:scale-110 transition-transform">⚙️</span> Admin
                  </Link>
                )}
                <a
                  href="https://discord.com/invite/UnDRjTc9jP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#6875F3] hover:to-[#5865F2] text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">💬</span> Discord
                </a>
                <button
                  onClick={handleLogout}
                  className="group px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400 rounded-xl transition-all border border-red-500/30 flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">🚪</span> Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="https://discord.com/invite/UnDRjTc9jP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#6875F3] hover:to-[#5865F2] text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">💬</span> Discord
                </a>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="group px-4 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">✨</span> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300 p-2 hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-slate-800 animate-fade-in">
            <Link
              href="/"
              className="block px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl shadow-lg shadow-emerald-500/25"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔍 Explore Plugins
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/account"
                  className="block px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🎮 My Plugins
                </Link>
                <Link
                  href="/deposit"
                  className="block px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💰 Add Coins
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <a
                  href="https://discord.com/invite/UnDRjTc9jP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💬 Discord
                </a>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 text-red-400 bg-red-500/10 rounded-xl mt-2"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="https://discord.com/invite/UnDRjTc9jP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💬 Discord
                </a>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔑 Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✨ Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
