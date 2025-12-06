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
    window.location.href = `/api/download/${plugin.id}`

    if (onDownload) {
      onDownload(plugin.id)
    }

    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <Card hover className="flex flex-col h-full animate-fade-in-up">
      {/* Plugin Logo */}
      <div className="relative w-full mb-3 flex items-center justify-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
          <div className="relative w-full h-full overflow-hidden bg-slate-700/50 rounded-xl sm:rounded-2xl ring-1 ring-slate-600/50 shadow-lg">
            <Image
              src={plugin.logo_url}
              alt={plugin.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 128px"
            />
          </div>
          {plugin.price_coins === 0 && (
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shadow-lg">
              FREE
            </div>
          )}
        </div>
      </div>

      {/* Plugin Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2 text-center line-clamp-2">
          {plugin.title}
        </h3>
        
        {/* Description - Hidden on mobile for compact view */}
        <div className="mb-3 flex-1 hidden sm:block">
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 text-center">
            {displayDescription}
          </p>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <span className="text-base sm:text-lg font-bold text-emerald-400">
            {plugin.price_coins === 0 ? 'FREE' : formatCurrency(plugin.price_coins)}
          </span>

          {isPurchased ? (
            <Button
              onClick={handleDownload}
              disabled={loading}
              variant="secondary"
              size="sm"
              className="w-full text-xs sm:text-sm"
            >
              {loading ? '...' : '📥 Download'}
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              variant="primary"
              size="sm"
              className="w-full text-xs sm:text-sm"
            >
              {loading ? '...' : (plugin.price_coins === 0 ? '🎁 Get' : '💰 Buy')}
            </Button>
          )}
        </div>
      </div>

      {/* View Details Link */}
      <Link
        href={`/plugin/${plugin.id}`}
        prefetch={true}
        className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors py-1"
      >
        Details →
      </Link>
    </Card>
  )
}
