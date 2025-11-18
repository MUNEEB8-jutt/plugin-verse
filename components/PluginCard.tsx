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
    <Card hover className="flex flex-col h-full">
      {/* Plugin Logo */}
      <div className="relative w-full h-48 mb-4 rounded overflow-hidden bg-bg-secondary">
        <Image
          src={plugin.logo_url}
          alt={plugin.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {plugin.price_coins === 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            FREE
          </div>
        )}
      </div>

      {/* Plugin Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-text-primary mb-2">{plugin.title}</h3>
        <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
          {plugin.description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-accent-primary">
            {plugin.price_coins === 0 ? 'FREE' : formatCurrency(plugin.price_coins)}
          </span>
          
          {isPurchased ? (
            <Button
              onClick={handleDownload}
              disabled={loading}
              variant="secondary"
            >
              {loading ? 'Downloading...' : 'Download'}
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? 'Processing...' : (plugin.price_coins === 0 ? 'Get Free' : 'Purchase')}
            </Button>
          )}
        </div>
      </div>

      {/* View Details Link */}
      <Link
        href={`/plugin/${plugin.id}`}
        className="mt-4 text-center text-accent-secondary hover:underline text-sm"
      >
        View Details →
      </Link>
    </Card>
  )
}
