'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plugin } from '@/lib/types/database'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
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
  const { showToast } = useToast()

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
        showToast(data.error || 'Purchase failed', 'error')
        return
      }

      const message = data.isFree
        ? 'Free plugin added to your library!'
        : 'Purchase successful! You can now download.'

      showToast(message, 'success')
      if (onPurchase) {
        onPurchase(plugin.id)
      }
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      showToast('An error occurred during purchase', 'error')
    } finally {
      setLoading(false)
    }
  }


  const handleDownload = () => {
    setLoading(true)
    showToast('Starting download...', 'info')
    window.location.href = `/api/download/${plugin.id}`

    if (onDownload) {
      onDownload(plugin.id)
    }

    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <article
      className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content Container */}
      <div className="relative p-4 sm:p-5 flex flex-col h-full">

        {/* Header: Logo + Title + Price Badge */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Plugin Logo */}
          <div className="relative flex-shrink-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden rounded-xl sm:rounded-2xl bg-slate-700/50 ring-2 ring-slate-600/30 group-hover:ring-emerald-500/30 transition-all shadow-lg">
              <Image
                src={plugin.logo_url}
                alt={`${plugin.title} - Minecraft Plugin Logo`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                itemProp="image"
              />
            </div>
            {/* Free Badge */}
            {plugin.price_coins === 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/30 uppercase tracking-wide">
                Free
              </span>
            )}
          </div>

          {/* Title & Meta */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors"
              itemProp="name"
            >
              {plugin.title}
            </h3>

            {/* Version & Platform Badges */}
            <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1.5">
              {plugin.version && (
                <span className="inline-flex items-center px-1.5 py-0.5 bg-slate-700/50 text-slate-300 rounded text-[10px] sm:text-xs font-medium">
                  v{plugin.version}
                </span>
              )}
              {plugin.platform && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium ${plugin.platform === 'plugin' ? 'bg-blue-500/20 text-blue-400' :
                  plugin.platform === 'mod-fabric' ? 'bg-purple-500/20 text-purple-400' :
                    plugin.platform === 'mod-forge' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-700/50 text-slate-300'
                  }`}>
                  {plugin.platform === 'plugin' ? '📄 Plugin' :
                    plugin.platform === 'mod-fabric' ? '🧵 Fabric' :
                      plugin.platform === 'mod-forge' ? '🔨 Forge' :
                        plugin.platform}
                </span>
              )}
            </div>

            {/* Price Display */}
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`text-sm sm:text-base font-bold ${plugin.price_coins === 0 ? 'text-emerald-400' : 'text-amber-400'}`}
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <meta itemProp="priceCurrency" content="COINS" />
                <span itemProp="price">{plugin.price_coins === 0 ? 'FREE' : formatCurrency(plugin.price_coins)}</span>
              </span>
            </div>
          </div>
        </div>


        {/* Description */}
        <p
          className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 flex-1"
          itemProp="description"
        >
          {plugin.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-auto">
          {isPurchased ? (
            <Button
              onClick={handleDownload}
              disabled={loading}
              variant="secondary"
              size="sm"
              className="flex-1 text-xs sm:text-sm py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-0 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </span>
              )}
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              variant="primary"
              size="sm"
              className={`flex-1 text-xs sm:text-sm py-2.5 sm:py-3 border-0 shadow-lg ${plugin.price_coins === 0
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/20'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  {plugin.price_coins === 0 ? (
                    <>
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      Get Free
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Buy Now
                    </>
                  )}
                </span>
              )}
            </Button>
          )}

          {/* Details Link */}
          <Link
            href={`/plugin/${plugin.id}`}
            prefetch={true}
            className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all text-xs sm:text-sm font-medium"
            title={`View ${plugin.title} details`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hidden SEO metadata */}
      <meta itemProp="applicationCategory" content="Game Plugin" />
      <meta itemProp="operatingSystem" content="Minecraft Server" />
    </article>
  )
}
