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
    <nav className="glass sticky top-0 z-40 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:brightness-110">
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/logo.png`}
              alt="PluginVerse"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold" style={{ fontFamily: 'monospace', color: '#4ade80' }}>
              PluginVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-text-primary hover:text-accent-primary">
              Plugins
            </Link>
            
            {user ? (
              <>
                <Link href="/account" className="text-text-primary hover:text-accent-primary">
                  Dashboard
                </Link>
                <Link href="/deposit" className="text-text-primary hover:text-accent-primary">
                  Deposit
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-accent-secondary hover:brightness-110">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:brightness-110"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-text-primary hover:text-accent-primary">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-accent-primary text-bg-primary px-4 py-2 rounded hover:brightness-110"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          <div className="md:hidden py-4 space-y-3">
            <Link
              href="/"
              className="block text-text-primary hover:text-accent-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plugins
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/account"
                  className="block text-text-primary hover:text-accent-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/deposit"
                  className="block text-text-primary hover:text-accent-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Deposit
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block text-accent-secondary hover:brightness-110"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-text-primary hover:text-accent-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block text-accent-primary hover:brightness-110"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
