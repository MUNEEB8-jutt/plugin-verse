'use client'

import { useState } from 'react'
import { PluginCard } from './PluginCard'
import { SearchBar } from './SearchBar'
import { Plugin } from '@/lib/types/database'

interface HomePageClientProps {
  plugins: Plugin[]
  purchasedPluginIds: string[]
}

export function HomePageClient({ plugins, purchasedPluginIds }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredPlugins = plugins.filter(plugin => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      plugin.title.toLowerCase().includes(query) ||
      plugin.description.toLowerCase().includes(query)
    )
  })

  return (
    <div className="page-transition">
      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} placeholder="🔍 Search plugins & mods..." />

      {/* Plugins Grid */}
      {filteredPlugins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlugins.map((plugin: Plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              isPurchased={purchasedPluginIds.includes(plugin.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p 
            className="text-2xl mb-4"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '1rem', color: '#d1d5db' }}
          >
            {searchQuery ? 'No plugins found' : 'No plugins available yet'}
          </p>
        </div>
      )}
    </div>
  )
}
