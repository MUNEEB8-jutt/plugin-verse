'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const INTRO_SOUND_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/intro.mp3`
const INTRO2_SOUND_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/intro2.mp3`

export function AboutPageContent() {
  const [isPlaying1, setIsPlaying1] = useState(false)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const audioRef1 = useRef<HTMLAudioElement | null>(null)
  const audioRef2 = useRef<HTMLAudioElement | null>(null)

  const handlePlayIntro1 = () => {
    if (!audioRef1.current) {
      audioRef1.current = new Audio(INTRO_SOUND_URL)
      audioRef1.current.volume = 1.0
      audioRef1.current.onended = () => setIsPlaying1(false)
    }
    if (isPlaying1) {
      audioRef1.current.pause()
      audioRef1.current.currentTime = 0
      setIsPlaying1(false)
    } else {
      audioRef1.current.play().catch(() => {})
      setIsPlaying1(true)
    }
  }

  const handlePlayIntro2 = () => {
    if (!audioRef2.current) {
      audioRef2.current = new Audio(INTRO2_SOUND_URL)
      audioRef2.current.volume = 1.0
      audioRef2.current.onended = () => setIsPlaying2(false)
    }
    if (isPlaying2) {
      audioRef2.current.pause()
      audioRef2.current.currentTime = 0
      setIsPlaying2(false)
    } else {
      audioRef2.current.play().catch(() => {})
      setIsPlaying2(true)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          About <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">PluginVerse</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Your trusted destination for premium Minecraft plugins and mods.</p>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Meet The Team</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-4xl">🎮</div>
            <h3 className="text-xl font-bold text-emerald-400 mb-2">MuneebYT</h3>
            <p className="text-slate-400 text-sm mb-4">Lead Developer & Content Creator</p>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">A passionate Minecraft enthusiast and skilled developer creating high-quality plugins.</p>
            <button onClick={handlePlayIntro1} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${isPlaying1 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
              {isPlaying1 ? 'Playing...' : '🎙️ Who We Are'}
            </button>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl">🍯</div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">HoneyBoy</h3>
            <p className="text-slate-400 text-sm mb-4">Co-Developer & Creative Mind</p>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">The creative force behind unique plugin concepts with deep Minecraft knowledge.</p>
            <button onClick={handlePlayIntro2} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${isPlaying2 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
              {isPlaying2 ? 'Playing...' : '💚 Why We Are Free?'}
            </button>
          </div>
        </div>
        <p className="text-slate-500 text-sm italic text-center mt-8">✨ Fun fact: Both are named Muneeb! 🎲</p>
      </div>

      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">🔗 Connect With Us</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://www.youtube.com/@ItxMuneebYT" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">YouTube</a>
          <a href="https://discord.com/invite/UnDRjTc9jP" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#5865F2]/20 text-[#7289DA] rounded-xl border border-[#5865F2]/30">Discord</a>
          <Link href="/" className="px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">Browse Plugins</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-16">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🎯 Our Mission</h2>
          <p className="text-slate-300">At PluginVerse, we believe every Minecraft server deserves premium-quality plugins without breaking the bank.</p>
        </div>
      </div>

      <p className="text-slate-600 text-sm text-center">© 2025 PluginVerse. Made with ❤️ by MuneebYT & HoneyBoy</p>
    </main>
  )
}
