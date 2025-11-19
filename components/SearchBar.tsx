'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search plugins..." }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    // Debounced search
    setTimeout(() => onSearch(value), 300)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-6 py-4 pr-24 bg-[#4b5563] border-4 border-black shadow-[4px_4px_0_#000,inset_2px_2px_0_rgba(0,0,0,0.3)] text-white placeholder-gray-300 focus:outline-none focus:border-[#4ade80] focus:shadow-[4px_4px_0_#000,inset_2px_2px_0_rgba(0,0,0,0.3),0_0_0_3px_rgba(74,222,128,0.3)] transition-all"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.75rem' }}
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
          🔍
        </div>
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-red-500 border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-[3px_3px_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[1px_1px_0_#000] transition-all text-white font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem' }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
