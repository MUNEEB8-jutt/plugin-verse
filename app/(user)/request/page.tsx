'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import Link from 'next/link'

const categories = [
  'Economy', 'Protection', 'Admin Tools', 'Chat', 'Fun & Games',
  'World Management', 'Utilities', 'Combat', 'Survival', 'Other'
]

const mcVersions = [
  '1.21.x', '1.20.x', '1.19.x', '1.18.x', '1.17.x', '1.16.x', '1.12.x', '1.8.x'
]

export default function RequestPluginPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestType, setRequestType] = useState<'plugin' | 'mod-fabric' | 'mod-forge'>('plugin')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plugin_name: '',
    minecraft_versions: [] as string[],
    category: '',
    core_features: '',
    detailed_description: ''
  })

  const handleVersionToggle = (version: string) => {
    setFormData(prev => ({
      ...prev,
      minecraft_versions: prev.minecraft_versions.includes(version)
        ? prev.minecraft_versions.filter(v => v !== version)
        : [...prev.minecraft_versions, version]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.minecraft_versions.length === 0) {
      showToast('Please select at least one Minecraft version', 'error')
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          request_type: requestType,
          minecraft_versions: formData.minecraft_versions.join(', ')
        })
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.error || 'Failed to submit', 'error')
        return
      }

      setSubmitted(true)
      showToast('Request submitted successfully!', 'success')
    } catch (err) {
      showToast('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-white mb-4">Request Submitted!</h1>
              <p className="text-slate-400 mb-6">
                Your {requestType === 'plugin' ? 'plugin' : 'mod'} request has been submitted successfully.
                <br />
                <span className="text-emerald-400 font-medium">
                  You will see your {requestType === 'plugin' ? 'plugin' : 'mod'} here in next 2-3 days!
                </span>
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/">
                  <Button>Browse Plugins</Button>
                </Link>
                <Button variant="secondary" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', plugin_name: '', minecraft_versions: [], category: '', core_features: '', detailed_description: '' }) }}>
                  Submit Another
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              🛠️ Create Your Own Plugin
            </h1>
            <p className="text-slate-400">
              Bring your idea into a plugin! Fill out the form below and we&apos;ll build it for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">What do you want?</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'plugin', label: '📄 Plugin', desc: 'Paper/Spigot' },
                  { value: 'mod-fabric', label: '🧵 Fabric Mod', desc: 'Fabric Loader' },
                  { value: 'mod-forge', label: '🔨 Forge Mod', desc: 'Forge Loader' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setRequestType(type.value as any)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      requestType === type.value
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <div className="text-lg font-medium">{type.label}</div>
                    <div className="text-xs text-slate-500">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Plugin Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {requestType === 'plugin' ? 'Plugin' : 'Mod'} Name
              </label>
              <input
                type="text"
                value={formData.plugin_name}
                onChange={(e) => setFormData({ ...formData, plugin_name: e.target.value })}
                required
                placeholder="e.g., SuperEconomy, MagicWands"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Minecraft Versions */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Minecraft Versions</label>
              <div className="flex flex-wrap gap-2">
                {mcVersions.map((version) => (
                  <button
                    key={version}
                    type="button"
                    onClick={() => handleVersionToggle(version)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                      formData.minecraft_versions.includes(version)
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {version}
                  </button>
                ))}
              </div>
              {formData.minecraft_versions.length > 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  Selected: {formData.minecraft_versions.join(', ')}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Core Features */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Core Features</label>
              <textarea
                value={formData.core_features}
                onChange={(e) => setFormData({ ...formData, core_features: e.target.value })}
                required
                rows={4}
                placeholder="List the main features you want:&#10;- Feature 1&#10;- Feature 2&#10;- Feature 3"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Description</label>
              <textarea
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                required
                rows={6}
                placeholder="Describe your plugin/mod idea in detail. What should it do? How should it work? Any specific requirements?"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                '🚀 Submit Request'
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
