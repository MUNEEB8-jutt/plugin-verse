'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plugin } from '@/lib/types/database'
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
      showToast(data.isFree ? 'Added to library!' : 'Purchase successful!', 'success')
      if (onPurchase) onPurchase(plugin.id)
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      showToast('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    setLoading(true)
    showToast('Starting download...', 'info')
    window.location.href = `/api/download/${plugin.id}`
    if (onDownload) onDownload(plugin.id)
    setTimeout(() => setLoading(false), 1000)
  }

  const getPlatformInfo = () => {
    switch (plugin.platform) {
      case 'plugin': return { label: 'Plugin', color: 'bg-blue-500/20 text-blue-400', icon: '📄' }
      case 'mod-fabric': return { label: 'Fabric', color: 'bg-purple-500/20 text-purple-400', icon: '🧵' }
      case 'mod-forge': return { label: 'Forge', color: 'bg-red-500/20 text-red-400', icon: '🔨' }
      default: return { label: 'Plugin', color: 'bg-slate-700/50 text-slate-300', icon: '📦' }
    }
  }


  const platformInfo = getPlatformInfo()

  return (
    <article
      className="group relative bg-slate-800/60 hover:bg-slate-800/80 rounded-xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-200"
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      {/* Top Section: Logo + Info */}
      <div className="p-3 sm:p-4">
        <div className="flex gap-3">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-lg bg-slate-700/50">
              <Image
                src={plugin.logo_url}
                alt={plugin.title}
                fill
                className="object-cover"
                sizes="56px"
                itemProp="image"
              />
            </div>
          </div>

          {/* Title + Badges */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-white leading-tight line-clamp-1 group-hover:text-emerald-400 transition-colors" itemProp="name">
              {plugin.title}
            </h3>
            
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {/* Platform */}
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${platformInfo.color}`}>
                {platformInfo.icon} {platformInfo.label}
              </span>
              
              {/* Version */}
              {plugin.version && (
                <span className="px-1.5 py-0.5 bg-slate-700/60 text-slate-400 rounded text-[10px] font-medium">
                  v{plugin.version}
                </span>
              )}
              
              {/* Price */}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                plugin.price_coins === 0 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {plugin.price_coins === 0 ? 'FREE' : `${plugin.price_coins} 🪙`}
              </span>
            </div>
          </div>
        </div>

        {/* Description - Full Width */}
        <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2" itemProp="description">
          {plugin.description}
        </p>
      </div>

      {/* Bottom Action Bar - CurseForge Style */}
      <div className="flex border-t border-slate-700/50">
        {/* Main Action Button */}
        {isPurchased ? (
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs sm:text-sm font-medium transition-all"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 text-white text-xs sm:text-sm font-medium transition-all ${
              plugin.price_coins === 0
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500'
            }`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {plugin.price_coins === 0 ? 'Install' : 'Get'}
              </>
            )}
          </button>
        )}

        {/* Info Button */}
        <Link
          href={`/plugin/${plugin.id}`}
          prefetch={true}
          className="flex items-center justify-center px-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors border-l border-slate-700/50"
          title="View details"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* SEO */}
      <meta itemProp="applicationCategory" content="Game Plugin" />
      <meta itemProp="operatingSystem" content="Minecraft Server" />
    </article>
  )
}
