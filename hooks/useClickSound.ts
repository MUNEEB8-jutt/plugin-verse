'use client'

import { useCallback, useRef } from 'react'

export function useClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playClick = useCallback(() => {
    // Create audio context for a simple click sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Simple soft click - low frequency, short duration
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      // Quick fade out for soft click
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.08)
    } catch (e) {
      // Silently fail if audio not supported
    }
  }, [])

  return { playClick }
}
