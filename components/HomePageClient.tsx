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
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  
  let filteredPlugins = plugins.filter(plugin => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!plugin.title.toLowerCase().includes(query) && 
          !plugin.description.toLowerCase().includes(query)) {
        return false
      }
    }
    // Platform filter
    if (platformFilter !== 'all' && plugin.platform !== platformFilter) {
      return false
    }
    return true
  })

  // Sort
  if (sortBy === 'newest') {
    filteredPlugins = [...filteredPlugins].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } else if (sortBy === 'oldest') {
    filteredPlugins = [...filteredPlugins].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  } else if (sortBy === 'price-low') {
    filteredPlugins = [...filteredPlugins].sort((a, b) => a.price_coins - b.price_coins)
  } else if (sortBy === 'price-high') {
    filteredPlugins = [...filteredPlugins].sort((a, b) => b.price_coins - a.price_coins)
  } else if (sortBy === 'free') {
    filteredPlugins = filteredPlugins.filter(p => p.price_coins === 0)
  }

  return (
    <div className="animate-fade-in">
      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} placeholder="Search plugins..." />


      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Platform Filter */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { value: 'all', label: 'All' },
            { value: 'plugin', label: '📄 Plugins' },
            { value: 'mod-fabric', label: '🧵 Fabric' },
            { value: 'mod-forge', label: '🔨 Forge' },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPlatformFilter(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                platformFilter === p.value
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800/50 text-slate-300 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="free">Free Only</option>
        </select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-slate-500 mb-4">
        {filteredPlugins.length} plugin{filteredPlugins.length !== 1 ? 's' : ''} found
      </p>

      {/* Plugins Grid */}
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
        <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-slate-400">
            {searchQuery || platformFilter !== 'all' 
              ? 'No plugins found with these filters' 
              : 'No plugins available yet'}
          </p>
          {(searchQuery || platformFilter !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setPlatformFilter('all'); setSortBy('newest') }}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
