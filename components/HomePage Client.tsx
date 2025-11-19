'use client'

import { useState, useEffect } from 'react'
import { PluginCard } from './PluginCard'
import { AdBanner } from './AdBanner'
import { Plugin } from '@/lib/types/database'

interface HomePageClientProps {
  initialPlugins: Plugin[]
  user: any
  isAdmin: boolean
  purchasedPluginIds: string[]
}

export function HomePageClient({ initialPlugins, user, isAdmin, purchasedPluginIds }: HomePageClientProps) {
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>(initialPlugins)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Filter plugins based on search query
    if (searchQuery.trim() === '') {
      setFilteredPlugins(initialPlugins)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = initialPlugins.filter(plugin =>
        plugin.title.toLowerCase().includes(query) ||
        plugin.description.toLowerCase().includes(query)
      )
      setFilteredPlugins(filtered)
    }
  }, [searchQuery, initialPlugins])

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <img 
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/logo.png`}
            alt="PluginVerse Logo - Minecraft Plugins & Mods Pakistan"
            className="w-20 h-20 object-contain animate-bounce-slow"
          />
          <h1 className="text-6xl font-bold animate-slide-up" style={{ fontFamily: 'monospace', color: '#4ade80' }}>
            PluginVerse
          </h1>
        </div>
        
        <div className="p-6 rounded-lg mb-8 animate-slide-up" style={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '2px solid #374151', backdropFilter: 'blur(10px)' }}>
          <h2 className="text-3xl font-semibold mb-2" style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
            Minecraft Plugins & Mods Marketplace
          </h2>
          <p className="text-lg mb-6" style={{ color: '#6b7280', fontFamily: 'monospace' }}>
            🇵🇰 Pakistan's #1 Platform | 🔍 Discover Premium & Free Plugins/Mods
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search plugins & mods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-lg text-lg transition-all duration-300 focus:ring-4 focus:ring-green-500 focus:scale-105"
                style={{ 
                  backgroundColor: 'rgba(55, 65, 81, 0.9)', 
                  color: 'white',
                  border: '2px solid #4ade80',
                  fontFamily: 'monospace'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                Found {filteredPlugins.length} result{filteredPlugins.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Action Buttons - Single Set */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {user && (
              <a 
                href="/account"
                className="px-6 py-3 rounded font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ 
                  backgroundColor: '#374151', 
                  color: 'white',
                  border: '2px solid #4b5563',
                  fontFamily: 'monospace'
                }}
              >
                📊 MY DASHBOARD
              </a>
            )}
            <a 
              href="/deposit"
              className="px-6 py-3 rounded font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: '#ca8a04', 
                color: 'black',
                fontFamily: 'monospace'
              }}
            >
              💰 ADD COINS
            </a>
            <a 
              href="https://discord.com/invite/UnDRjTc9jP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded font-bold transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#5865F2', color: 'white', fontFamily: 'monospace' }}
            >
              <span>💬</span> Discord
            </a>
            <a 
              href="https://www.youtube.com/@ItxMuneebYT"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded font-bold transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#FF0000', color: 'white', fontFamily: 'monospace' }}
            >
              <span>▶️</span> YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Plugins Grid */}
      {filteredPlugins.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins.map((plugin: Plugin, index: number) => (
              <div
                key={plugin.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PluginCard
                  plugin={plugin}
                  isPurchased={purchasedPluginIds.includes(plugin.id)}
                />
              </div>
            ))}
          </div>

          {/* Bottom Banner Ad */}
          <div className="mt-12 animate-fade-in">
            <AdBanner 
              dataAdSlot="1122334455"
              dataAdFormat="horizontal"
              className="max-w-4xl mx-auto"
            />
          </div>
        </>
      ) : (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-2xl mb-2" style={{ color: '#9ca3af' }}>
            {searchQuery ? 'No plugins or mods found' : 'No plugins available yet'}
          </p>
          {searchQuery && (
            <p className="text-lg mb-4" style={{ color: '#6b7280' }}>
              Try a different search term
            </p>
          )}
          {isAdmin && !searchQuery && (
            <p className="text-lg mt-4" style={{ color: '#6b7280' }}>
              Go to the <a href="/admin/plugins" className="text-green-400 hover:underline">admin panel</a> to add plugins & mods
            </p>
          )}
        </div>
      )}
    </>
  )
}
