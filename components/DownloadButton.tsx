'use client'

import { useState } from 'react'
import { Button } from './ui/Button'

interface DownloadButtonProps {
  pluginId: string
  pluginTitle: string
}

export function DownloadButton({ pluginId, pluginTitle }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    setLoading(true)
    // Direct navigation to download API - it will redirect to file
    window.location.href = `/api/download/${pluginId}`
    // Reset loading after a short delay
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant="secondary"
      className="w-full"
    >
      {loading ? 'Preparing Download...' : 'Download Plugin'}
    </Button>
  )
}
