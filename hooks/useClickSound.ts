'use client'

import { useCallback, useRef } from 'react'

const CLICK_SOUND_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/click.mp3`

export function useClickSound() {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const playClick = useCallback(() => {
        try {
            if (!audioRef.current) {
                audioRef.current = new Audio(CLICK_SOUND_URL)
                audioRef.current.volume = 0.3
            }
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => { })
        } catch (e) { }
    }, [])

    return { playClick }
}
