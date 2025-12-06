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
      {/* Plugin Logo - Bigger */}
      <div className="relative w-full mb-4 flex items-center justify-center">
        <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36">
          <div className="relative w-full h-full overflow-hidden bg-slate-700/50 rounded-2xl ring-1 ring-slate-600/50 shadow-lg">
            <Image
              src={plugin.logo_url}
              alt={plugin.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 150px, 200px"
            />
          </div>
          {plugin.price_coins === 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
              FREE
            </div>
          )}
        </div>
      </div>

      {/* Plugin Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-base md:text-lg font-semibold text-white mb-2 text-center line-clamp-2">
          {plugin.title}
        </h3>
        
        <div className="mb-4 flex-1">
          <p className="text-sm text-slate-400 line-clamp-3 text-center">
            {displayDescription}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-xs text-blue-400 hover:text-blue-300 mt-1 w-full text-center transition-colors"
            >
              {showFullDescription ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-lg font-bold text-emerald-400">
            {plugin.price_coins === 0 ? 'FREE' : formatCurrency(plugin.price_coins)}
          </span>

          {isPurchased ? (
            <Button
              onClick={handleDownload}
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              {loading ? 'Loading...' : '📥 Download'}
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? 'Wait...' : (plugin.price_coins === 0 ? '🎁 Get Free' : '💰 Buy Now')}
            </Button>
          )}
        </div>
      </div>

      {/* View Details Link */}
      <Link
        href={`/plugin/${plugin.id}`}
        prefetch={true}
        className="mt-4 text-center text-sm text-blue-400 hover:text-blue-300 transition-colors py-2"
      >
        View Details →
      </Link>
    </Card>
  )
}
