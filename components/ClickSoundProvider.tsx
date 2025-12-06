'use client'

import { useEffect, useRef } from 'react'

const CLICK_SOUND_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/click.mp3`

export function ClickSoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Preload audio
    audioRef.current = new Audio(CLICK_SOUND_URL)
    audioRef.current.volume = 0.15

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Play sound for buttons and clickable elements
      if (
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]')
      ) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => {})
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return <>{children}</>
}
