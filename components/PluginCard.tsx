'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plugin } from '@/lib/types/database'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { formatCurrency } from '@/lib/utils/helpers'
import { useState } from 'react'

interface PluginCardProps {
  plugin: Plugin
  isPurchased?: boolean
  onPurchase?: (pluginId: string) => void
  onDownload?: (pluginId: string) => void
}

export function PluginCard({ plugin, isPurchased, onPurchase, onDownload }: PluginCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFullDescription, setShowFullDescription] = useState(false)

  const MAX_DESC_LENGTH = 100
  const shouldTruncate = plugin.description.length > MAX_DESC_LENGTH
  const displayDescription = showFullDescription || !shouldTruncate
    ? plugin.description
    : plugin.description.slice(0, MAX_DESC_LENGTH) + '...'

  const handlePurchase = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/plugins/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId: plugin.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Purchase failed')
        alert(data.error || 'Purchase failed')
        return
      }

      const message = data.isFree
        ? 'Free plugin added to your library! You can now download it.'
        : 'Purchase successful! You can now download the plugin.'

      alert(message)
      if (onPurchase) {
        onPurchase(plugin.id)
      }
      window.location.reload()
    } catch (err) {
      setError('An error occurred')
      alert('An error occurred during purchase')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    setLoading(true)
    // Direct navigation to download API - it will redirect to file
    window.location.href = `/api/download/${plugin.id}`

    if (onDownload) {
      onDownload(plugin.id)
    }

    // Reset loading after a short delay
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <Card hover className="flex flex-col h-full animate-block-place">
      {/* Plugin Logo - Responsive */}
      <div className="relative w-full h-40 md:h-48 mb-3 md:mb-4 overflow-hidden bg-[#292524] border-2 border-black">
        <Image
          src={plugin.logo_url}
          alt={plugin.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ imageRendering: 'pixelated' }}
        />
        {plugin.price_coins === 0 && (
          <div
            className="absolute top-2 right-2 bg-gradient-to-b from-[#4ade80] to-[#22c55e] text-black px-2 py-1 md:px-3 md:py-1 border-2 border-black shadow-[2px_2px_0_#000] font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.55rem' }}
          >
            FREE
          </div>
        )}
      </div>

      {/* Plugin Info - Responsive */}
      <div className="flex-1 flex flex-col">
        <h3
          className="text-lg md:text-xl font-bold mb-2"
          style={{ fontFamily: "'Press Start 2P', monospace", color: '#4ade80', textShadow: '2px 2px 0 #000' }}
        >
          {plugin.title}
        </h3>
        <div className="mb-3 md:mb-4 flex-1">
          <p
            className="text-xs md:text-sm mb-2"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem', color: '#d1d5db', lineHeight: '1.6' }}
          >
            {displayDescription}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-xs font-bold hover:brightness-110 transition-all min-h-[32px] py-1"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.5rem', color: '#60a5fa' }}
            >
              {showFullDescription ? '▲ Show Less' : '▼ Show More'}
            </button>
          )}
        </div>

        {/* Price and Action - Responsive */}
        <div className="flex items-center justify-between mt-auto gap-2">
          <span
            className="text-xl md:text-2xl font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace", color: '#ca8a04', textShadow: '2px 2px 0 #000' }}
          >
            {plugin.price_coins === 0 ? 'FREE' : formatCurrency(plugin.price_coins)}
          </span>

          {isPurchased ? (
            <Button
              onClick={handleDownload}
              disabled={loading}
              className="bg-gradient-to-b from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] px-3 py-2 md:px-4 md:py-2.5 min-h-[44px] text-xs md:text-sm"
              style={{ fontSize: '0.6rem' }}
            >
              {loading ? '⏳' : '📥 Download'}
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="bg-gradient-to-b from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] px-3 py-2 md:px-4 md:py-2.5 min-h-[44px] text-xs md:text-sm"
              style={{ fontSize: '0.6rem' }}
            >
              {loading ? '⏳' : (plugin.price_coins === 0 ? '🎁 Get' : '💰 Buy')}
            </Button>
          )}
        </div>
      </div>

      {/* View Details Link - Responsive */}
      <Link
        href={`/plugin/${plugin.id}`}
        prefetch={true}
        className="mt-3 md:mt-4 text-center hover:brightness-110 transition-all font-bold py-2 min-h-[36px] flex items-center justify-center"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem', color: '#3b82f6', textShadow: '1px 1px 0 #000' }}
      >
        Details →
      </Link>
    </Card>
  )
}
