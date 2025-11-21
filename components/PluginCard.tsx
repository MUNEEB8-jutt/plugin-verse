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
  const [showFullDescription, setShowFullDescription] = useState(false)

  const MAX_DESC_LENGTH = 100
  const shouldTruncate = plugin.description.length > MAX_DESC_LENGTH
  const displayDescription = showFullDescription || !shouldTruncate
    ? plugin.description
    : plugin.description.slice(0, MAX_DESC_LENGTH) + '...'

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/plugins/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId: plugin.id }),
      })

      const data = await response.json()

      if (!response.ok) {
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
      {/* Plugin Logo - Clean circular on mobile, pixelated on desktop */}
      <div className="relative w-full mb-2 md:mb-3 flex items-center justify-center">
        <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32">
          <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 lg:bg-[#292524] border border-blue-500/30 lg:border-2 lg:border-black rounded-full shadow-lg shadow-blue-500/20 lg:shadow-none">
            <Image
              src={plugin.logo_url}
              alt={plugin.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ imageRendering: 'auto' }}
            />
          </div>
          {plugin.price_coins === 0 && (
            <div
              className="absolute -top-1 -right-1 bg-gradient-to-br from-green-400 to-green-500 lg:bg-gradient-to-b lg:from-[#4ade80] lg:to-[#22c55e] text-white lg:text-black px-2 py-0.5 border border-green-400/50 lg:border-2 lg:border-black shadow-lg shadow-green-500/30 lg:shadow-[2px_2px_0_#000] font-semibold lg:font-bold rounded-full text-[0.6rem] lg:text-[0.4rem]"
            >
              FREE
            </div>
          )}
        </div>
      </div>

      {/* Plugin Info - Clean modern on mobile */}
      <div className="flex-1 flex flex-col justify-between">
        <h3
          className="text-sm md:text-base lg:text-xl font-semibold lg:font-bold mb-1 text-center lg:text-left line-clamp-1 lg:line-clamp-2 text-white lg:text-[#4ade80]"
          style={{ 
            fontFamily: "window.innerWidth > 1024 ? \"'Press Start 2P', monospace\" : \"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\"",
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
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

        {/* Price and Action - Clean modern on mobile */}
        <div className="flex flex-col items-center justify-center gap-2 w-full px-2">
          <span className="text-base md:text-lg lg:text-xl font-bold text-blue-400 lg:text-[#ca8a04]">
            {plugin.price_coins === 0 ? 'FREE' : formatCurrency(plugin.price_coins)}
          </span>

          {isPurchased ? (
            <Button
              onClick={handleDownload}
              disabled={loading}
              variant="secondary"
            >
              {loading ? '⏳ Loading...' : '📥 Download'}
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              variant="primary"
            >
              {loading ? '⏳ Wait...' : (plugin.price_coins === 0 ? '🎁 Get Free' : '💰 Buy Now')}
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
