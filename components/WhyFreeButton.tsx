'use client'

import { useState, useRef } from 'react'

const INTRO2_SOUND_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/intro2.mp3`

export function WhyFreeButton() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleClick = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(INTRO2_SOUND_URL)
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
    <button
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
        isPlaying
          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
          : 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 hover:from-emerald-500/30 hover:to-cyan-500/30'
      }`}
    >
      {isPlaying ? (
        <>
          <span className="w-5 h-5 flex items-center justify-center">
            <span className="flex gap-0.5">
              <span className="w-1 h-4 bg-white rounded-full animate-pulse" />
              <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-75" />
              <span className="w-1 h-5 bg-white rounded-full animate-pulse delay-150" />
            </span>
          </span>
          Playing...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          💚 Why We Are Free?
        </>
      )}
    </button>
  )
}
