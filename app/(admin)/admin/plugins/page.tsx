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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCoins: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [pluginFile, setPluginFile] = useState<File | null>(null)
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
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('priceCoins', formData.priceCoins)

      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      }
      if (pluginFile) {
        formDataToSend.append('file', pluginFile)
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
    setFormData({ title: '', description: '', priceCoins: '' })
    setLogoFile(null)
    setPluginFile(null)
    setEditingPlugin(null)
    setError('')
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <AdminNav />
          <div className="flex-1">
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <AdminNav />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-accent-primary">Manage Plugins</h1>
            <Button onClick={openCreateModal}>Add New Plugin</Button>
          </div>

          <div className="glass rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Logo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plugins.map((plugin) => (
                  <tr key={plugin.id} className="border-t border-border">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={plugin.logo_url}
                          alt={plugin.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{plugin.title}</p>
                        <p className="text-sm text-text-secondary line-clamp-1">
                          {plugin.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-accent-primary font-bold">
                      {plugin.price_coins === 0 ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        `${plugin.price_coins} Coins`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(plugin)}
                          variant="secondary"
                          className="text-sm px-4 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(plugin.id)}
                          variant="danger"
                          className="text-sm px-4 py-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {plugins.length === 0 && (
              <div className="text-center py-12 text-text-secondary">
                No plugins yet. Add your first plugin!
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
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
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
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 bg-bg-secondary border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>

          <div>
            <Input
              label="Price (Coins)"
              type="number"
              value={formData.priceCoins}
              onChange={(e) => setFormData({ ...formData, priceCoins: e.target.value })}
              required
              min="0"
            />
            <p className="text-xs text-text-secondary mt-1">
              💡 Set to 0 for free plugins that users can download without payment
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Logo {editingPlugin && '(leave empty to keep current)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              required={!editingPlugin}
              className="w-full px-4 py-2 bg-bg-secondary border border-border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Plugin File {editingPlugin && '(leave empty to keep current)'}
            </label>
            <input
              type="file"
              accept=".zip,.jar"
              onChange={(e) => setPluginFile(e.target.files?.[0] || null)}
              required={!editingPlugin}
              className="w-full px-4 py-2 bg-bg-secondary border border-border rounded"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Saving...' : editingPlugin ? 'Update Plugin' : 'Create Plugin'}
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
