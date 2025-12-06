'use client'

import { useState, useEffect } from 'react'
import { AdminNav } from '@/components/AdminNav'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Plugin } from '@/lib/types/database'
import Image from 'next/image'

export default function AdminPluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCoins: '',
    version: '1.0.0',
    platform: 'plugin-paper' as 'plugin-paper' | 'plugin-bukkit' | 'mod-fabric' | 'mod-forge',
    downloadType: 'upload' as 'upload' | 'external',
    externalUrl: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [pluginFiles, setPluginFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPlugins()
  }, [])

  const fetchPlugins = async () => {
    try {
      const response = await fetch('/api/plugins')
      const data = await response.json()
      if (response.ok) {
        setPlugins(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch plugins:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)


    try {
      if (formData.downloadType === 'upload' && pluginFiles.length === 0 && !editingPlugin) {
        setError('Please select at least one plugin file')
        setSubmitting(false)
        return
      }

      if (formData.downloadType === 'external' && !formData.externalUrl.trim()) {
        setError('Please provide an external download URL')
        setSubmitting(false)
        return
      }

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('priceCoins', formData.priceCoins)
      formDataToSend.append('version', formData.version)
      formDataToSend.append('platform', formData.platform)
      formDataToSend.append('downloadType', formData.downloadType)

      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      }

      if (formData.downloadType === 'upload') {
        pluginFiles.forEach((file) => {
          formDataToSend.append('files', file)
        })
      } else {
        formDataToSend.append('externalUrl', formData.externalUrl)
      }

      const url = editingPlugin ? `/api/plugins/${editingPlugin.id}` : '/api/plugins'
      const method = editingPlugin ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save plugin')
        setSubmitting(false)
        return
      }

      setShowModal(false)
      resetForm()
      fetchPlugins()
    } catch (err) {
      setError('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (plugin: Plugin) => {
    setEditingPlugin(plugin)
    setFormData({
      title: plugin.title,
      description: plugin.description,
      priceCoins: plugin.price_coins.toString(),
      version: plugin.version || '1.0.0',
      platform: plugin.platform || 'plugin-paper',
      downloadType: plugin.download_type,
      externalUrl: plugin.external_url || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plugin?')) return

    try {
      const response = await fetch(`/api/plugins/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPlugins()
      }
    } catch (err) {
      console.error('Failed to delete plugin:', err)
    }
  }

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      priceCoins: '',
      version: '1.0.0',
      platform: 'plugin-paper',
      downloadType: 'upload',
      externalUrl: '',
    })
    setLogoFile(null)
    setPluginFiles([])
    setEditingPlugin(null)
    setError('')
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <AdminNav />
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-slate-400">
                <span className="w-5 h-5 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin" />
                Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Nav Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl text-white"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Admin Menu
              </span>
              <svg className={`w-5 h-5 transition-transform ${mobileNavOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileNavOpen && (
              <div className="mt-2 animate-fade-in">
                <AdminNav />
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:block">
            <AdminNav />
          </div>

          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage Plugins</h1>
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Plugin
              </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Logo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {plugins.map((plugin) => (
                      <tr key={plugin.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                            <Image src={plugin.logo_url} alt={plugin.title} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-white">{plugin.title}</p>
                          <p className="text-sm text-slate-400 line-clamp-1">{plugin.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          {plugin.download_type === 'upload' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                              📦 Upload
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                              🔗 External
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {plugin.price_coins === 0 ? (
                            <span className="text-emerald-400 font-bold">FREE</span>
                          ) : (
                            <span className="text-amber-400 font-bold">{plugin.price_coins} Coins</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(plugin)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => handleDelete(plugin.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {plugins.map((plugin) => (
                <div key={plugin.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0">
                      <Image src={plugin.logo_url} alt={plugin.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{plugin.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mt-1">{plugin.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-3">
                      {plugin.download_type === 'upload' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                          📦 Upload
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                          🔗 External
                        </span>
                      )}
                      {plugin.price_coins === 0 ? (
                        <span className="text-emerald-400 font-bold text-sm">FREE</span>
                      ) : (
                        <span className="text-amber-400 font-bold text-sm">{plugin.price_coins} Coins</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(plugin)} className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(plugin.id)} className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {plugins.length === 0 && (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-slate-400 mb-4">No plugins yet</p>
                <Button onClick={openCreateModal}>Add Your First Plugin</Button>
              </div>
            )}
          </div>
        </div>
      </div>


      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
        title={editingPlugin ? 'Edit Plugin' : 'Add New Plugin'}
      >
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Price (Coins)"
                type="number"
                value={formData.priceCoins}
                onChange={(e) => setFormData({ ...formData, priceCoins: e.target.value })}
                required
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">0 = Free</p>
            </div>
            <div>
              <Input
                label="Version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="1.0.0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'plugin-paper', label: '📄 Paper/Spigot', color: 'blue' },
                { value: 'plugin-bukkit', label: '🪣 Bukkit', color: 'orange' },
                { value: 'mod-fabric', label: '🧵 Fabric Mod', color: 'purple' },
                { value: 'mod-forge', label: '🔨 Forge Mod', color: 'red' },
              ].map((p) => (
                <label
                  key={p.value}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl cursor-pointer border transition-all text-sm ${
                    formData.platform === p.value
                      ? `bg-${p.color}-500/20 border-${p.color}-500/50 text-${p.color}-400`
                      : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                  }`}
                  style={{
                    backgroundColor: formData.platform === p.value ? `var(--${p.color}-bg)` : undefined,
                    borderColor: formData.platform === p.value ? `var(--${p.color}-border)` : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name="platform"
                    value={p.value}
                    checked={formData.platform === p.value}
                    onChange={() => setFormData({ ...formData, platform: p.value as any })}
                    className="sr-only"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Logo {editingPlugin && <span className="text-slate-500">(optional)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              required={!editingPlugin}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-white file:font-medium file:cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Download Method</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer border transition-all ${formData.downloadType === 'upload' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                <input
                  type="radio"
                  name="downloadType"
                  value="upload"
                  checked={formData.downloadType === 'upload'}
                  onChange={() => setFormData({ ...formData, downloadType: 'upload' })}
                  className="sr-only"
                />
                <span>📦 Upload</span>
              </label>
              <label className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer border transition-all ${formData.downloadType === 'external' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                <input
                  type="radio"
                  name="downloadType"
                  value="external"
                  checked={formData.downloadType === 'external'}
                  onChange={() => setFormData({ ...formData, downloadType: 'external' })}
                  className="sr-only"
                />
                <span>🔗 External</span>
              </label>
            </div>
          </div>

          {formData.downloadType === 'upload' ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Plugin Files {editingPlugin && <span className="text-slate-500">(optional)</span>}
              </label>
              <input
                type="file"
                accept=".zip,.jar"
                multiple
                onChange={(e) => setPluginFiles(Array.from(e.target.files || []))}
                required={!editingPlugin}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-white file:font-medium file:cursor-pointer"
              />
              {pluginFiles.length > 0 && (
                <p className="text-xs text-emerald-400 mt-2">{pluginFiles.length} file(s) selected</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">External URL</label>
              <input
                type="url"
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                placeholder="https://example.com/download"
                required={formData.downloadType === 'external'}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Saving...' : editingPlugin ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
