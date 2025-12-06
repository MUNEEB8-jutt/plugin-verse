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
    <div className="animate-fade-in">
      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} placeholder="Search plugins..." />

      {/* Plugins Grid - 2 columns on mobile */}
      {filteredPlugins.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {filteredPlugins.map((plugin: Plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              isPurchased={purchasedPluginIds.includes(plugin.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">
            {searchQuery ? 'No plugins found matching your search' : 'No plugins available yet'}
          </p>
        </div>
      )}
    </div>
  )
}
