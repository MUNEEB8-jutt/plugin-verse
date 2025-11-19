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
    <nav 
      className="sticky top-0 z-40 border-b-4 border-black relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #92400e 0%, #78350f 100%)',
        boxShadow: '0 4px 0 #000, inset 0 2px 0 rgba(255,255,255,0.2)'
      }}
    >
      {/* Wood texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/textures/wood.png)',
          backgroundSize: '64px 64px',
          imageRendering: 'pixelated'
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:brightness-110 transition-all">
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/logo.png`}
              alt="PluginVerse"
              className="w-10 h-10 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <span 
              className="text-2xl font-bold"
              style={{ 
                fontFamily: "'Press Start 2P', monospace", 
                color: '#4ade80',
                textShadow: '2px 2px 0 #000'
              }}
            >
              PluginVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-white hover:text-[#4ade80] transition-colors font-bold"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', textShadow: '1px 1px 0 #000' }}
            >
              Plugins
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/account" 
                  className="text-white hover:text-[#4ade80] transition-colors font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', textShadow: '1px 1px 0 #000' }}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/deposit" 
                  className="text-white hover:text-[#4ade80] transition-colors font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', textShadow: '1px 1px 0 #000' }}
                >
                  Deposit
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-[#3b82f6] hover:brightness-110 font-bold"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', textShadow: '1px 1px 0 #000' }}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white px-4 py-2 border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-[3px_3px_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[1px_1px_0_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-white hover:text-[#4ade80] transition-colors font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', textShadow: '1px 1px 0 #000' }}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-b from-[#4ade80] to-[#22c55e] text-black px-4 py-2 border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-[3px_3px_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[1px_1px_0_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem' }}
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
