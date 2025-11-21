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
    <Card hover className="flex flex-col animate-block-place aspect-square lg:aspect-auto lg:h-full">
      {/* Plugin Logo - Perfect square with circular image */}
      <div className="relative w-full mb-2 md:mb-3 flex items-center justify-center">
        <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32">
          <div className="relative w-full h-full overflow-hidden bg-[#292524] border-2 border-black rounded-full">
            <Image
              src={plugin.logo_url}
              alt={plugin.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          {plugin.price_coins === 0 && (
            <div
              className="absolute -top-1 -right-1 bg-gradient-to-b from-[#4ade80] to-[#22c55e] text-black px-1.5 py-0.5 border-2 border-black shadow-[2px_2px_0_#000] font-bold rounded-full"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.4rem' }}
            >
              FREE
            </div>
          )}
        </div>
      </div>

      {/* Plugin Info - Compact for mobile */}
      <div className="flex-1 flex flex-col justify-between">
        <h3
          className="text-xs md:text-sm lg:text-xl font-bold mb-1 text-center line-clamp-1 lg:line-clamp-2"
          style={{ fontFamily: "'Press Start 2P', monospace", color: '#4ade80', textShadow: '1px 1px 0 #000', fontSize: '0.6rem' }}
        >
          {plugin.title}
        </h3>
        <div className="mb-1 md:mb-2 lg:mb-4 flex-1 hidden lg:block">
          <p
            className="text-xs md:text-sm mb-1 md:mb-2 line-clamp-2 lg:line-clamp-none"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.5rem', color: '#d1d5db', lineHeight: '1.5' }}
          >
            {displayDescription}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="hidden lg:block text-xs font-bold hover:brightness-110 transition-all min-h-[32px] py-1"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.5rem', color: '#60a5fa' }}
            >
              {showFullDescription ? '▲ Show Less' : '▼ Show More'}
            </button>
          )}
        </div>

        {/* Price and Action - Compact for mobile */}
        <div className="flex flex-col items-center justify-center gap-1.5 md:gap-2">
          <span
            className="text-sm md:text-base lg:text-xl font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace", color: '#ca8a04', textShadow: '1px 1px 0 #000', fontSize: '0.65rem' }}
          >
            {plugin.price_coins === 0 ? 'FREE' : formatCurrency(plugin.price_coins)}
          </span>

          {isPurchased ? (
            <Button
              onClick={handleDownload}
              disabled={loading}
              className="w-full bg-gradient-to-b from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 min-h-[36px] lg:min-h-[40px] text-xs"
              style={{ fontSize: '0.5rem' }}
            >
              {loading ? '⏳' : '📥 Get'}
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-gradient-to-b from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 min-h-[36px] lg:min-h-[40px] text-xs"
              style={{ fontSize: '0.5rem' }}
            >
              {loading ? '⏳' : (plugin.price_coins === 0 ? '🎁 Free' : '💰 Buy')}
            </Button>
          )}
        </div>
      </div>

      {/* View Details Link - Hidden on mobile, shown on desktop */}
      <Link
        href={`/plugin/${plugin.id}`}
        prefetch={true}
        className="hidden lg:flex mt-3 md:mt-4 text-center hover:brightness-110 transition-all font-bold py-2 min-h-[36px] items-center justify-center"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem', color: '#3b82f6', textShadow: '1px 1px 0 #000' }}
      >
        Details →
      </Link>
    </Card>
  )
}
