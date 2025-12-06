'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const INTRO_SOUND_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/intro.mp3`

export function AboutContent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlayIntro = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(INTRO_SOUND_URL)
      audioRef.current.volume = 1.0
      audioRef.current.onended = () => setIsPlaying(false)
    }

    if (isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          About <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">PluginVerse</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Your trusted destination for premium Minecraft plugins and mods, crafted with passion and expertise.
        </p>
      </div>

      {/* Team Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Meet The Team</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* MuneebYT */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-all">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-4xl">
              🎮
            </div>
            <h3 className="text-xl font-bold text-emerald-400 mb-2">MuneebYT</h3>
            <p className="text-slate-400 text-sm mb-4">
              Lead Developer & Content Creator
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              A passionate Minecraft enthusiast and skilled developer with years of experience in creating 
              high-quality plugins and mods. Known for innovative solutions and clean code that powers 
              thousands of servers worldwide.
            </p>
          </div>

          {/* HoneyBoy */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl">
              🍯
            </div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">HoneyBoy</h3>
            <p className="text-slate-400 text-sm mb-4">
              Co-Developer & Creative Mind
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              The creative force behind many unique plugin concepts. With a deep understanding of 
              Minecraft mechanics and player needs, HoneyBoy brings fresh ideas to life with 
              exceptional attention to detail.
            </p>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm italic">
            ✨ Fun fact: Both of them are named Muneeb! What are the odds? 🎲
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🎯 Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            At PluginVerse, we believe every Minecraft server deserves access to premium-quality plugins 
            without breaking the bank. Our mission is to create innovative, reliable, and user-friendly 
            plugins that enhance your gaming experience. Whether you&apos;re running a small private server 
            or a large network, we&apos;ve got you covered.
          </p>
        </div>
      </div>

      {/* Listen to Our Intro */}
      <div className="max-w-xl mx-auto mb-16 text-center">
        <h2 className="text-xl font-bold text-white mb-4">🎙️ Hear Our Story</h2>
        <button
          onClick={handlePlayIntro}
          className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-lg transition-all ${
            isPlaying
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105'
              : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 hover:scale-105'
          }`}
        >
          {isPlaying ? (
            <>
              <span className="flex gap-1">
                <span className="w-1 h-5 bg-white rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
                <span className="w-1 h-6 bg-white rounded-full animate-pulse delay-150" />
              </span>
              Playing Introduction...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Play Introduction
            </>
          )}
        </button>
      </div>

      {/* Connect With Us */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-6">🔗 Connect With Us</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {/* YouTube */}
          <a
            href="https://www.youtube.com/@ItxMuneebYT"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </a>

          {/* Discord */}
          <a
            href="https://discord.com/invite/UnDRjTc9jP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#7289DA] rounded-xl border border-[#5865F2]/30 hover:border-[#5865F2]/50 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord Server
          </a>

          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Browse Plugins
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-slate-600 text-sm">
          © 2025 PluginVerse. Made with ❤️ by MuneebYT & HoneyBoy
        </p>
      </div>
    </main>
  )
}
