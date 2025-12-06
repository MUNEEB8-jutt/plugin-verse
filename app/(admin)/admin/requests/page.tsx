'use client'

import { useState, useEffect } from 'react'
import { AdminNav } from '@/components/AdminNav'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PluginRequest } from '@/lib/types/database'
import { formatDate } from '@/lib/utils/helpers'

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<PluginRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<PluginRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests')
      const data = await response.json()
      if (response.ok) {
        setRequests(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (response.ok) {
        fetchRequests()
        setShowModal(false)
        setSelectedRequest(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const filteredRequests = requests.filter(r => filter === 'all' || r.status === filter)


  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'plugin': return { label: 'Plugin', icon: '📄', color: 'text-blue-400' }
      case 'mod-fabric': return { label: 'Fabric', icon: '🧵', color: 'text-purple-400' }
      case 'mod-forge': return { label: 'Forge', icon: '🔨', color: 'text-orange-400' }
      default: return { label: 'Unknown', icon: '❓', color: 'text-slate-400' }
    }
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
          <AdminNav />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">📝 Plugin Requests</h1>
              
              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'in_progress', 'completed', 'rejected'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {f === 'all' ? 'All' : f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const typeInfo = getTypeInfo(request.request_type)
                return (
                  <div key={request.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{request.plugin_name}</h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusStyle(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-3">
                          <span className={typeInfo.color}>{typeInfo.icon} {typeInfo.label}</span>
                          <span>•</span>
                          <span>{request.category}</span>
                          <span>•</span>
                          <span>{request.minecraft_versions}</span>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">
                          <span className="text-slate-500">By:</span> {request.name} ({request.email})
                        </p>
                        <p className="text-slate-400 text-sm line-clamp-2">{request.core_features}</p>
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => { setSelectedRequest(request); setShowModal(true) }}
                          className="text-sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-500">
                      Submitted: {formatDate(request.created_at)}
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <p className="text-slate-400">No {filter !== 'all' ? filter.replace('_', ' ') : ''} requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSelectedRequest(null) }} title="Request Details">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Plugin/Mod Name</p>
                <p className="font-semibold text-white">{selectedRequest.plugin_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Type</p>
                <p className="text-white">{getTypeInfo(selectedRequest.request_type).icon} {getTypeInfo(selectedRequest.request_type).label}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Requester</p>
                <p className="text-white">{selectedRequest.name}</p>
                <p className="text-sm text-slate-500">{selectedRequest.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Category</p>
                <p className="text-white">{selectedRequest.category}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-slate-400">Minecraft Versions</p>
              <p className="text-white">{selectedRequest.minecraft_versions}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-1">Core Features</p>
              <p className="text-white whitespace-pre-wrap bg-slate-800 p-3 rounded-lg text-sm">{selectedRequest.core_features}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-1">Detailed Description</p>
              <p className="text-white whitespace-pre-wrap bg-slate-800 p-3 rounded-lg text-sm">{selectedRequest.detailed_description}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
              {selectedRequest.status === 'pending' && (
                <>
                  <Button onClick={() => updateStatus(selectedRequest.id, 'in_progress')} disabled={updating} className="flex-1 bg-blue-500 hover:bg-blue-400">
                    {updating ? 'Updating...' : '🚀 Start Working'}
                  </Button>
                  <Button onClick={() => updateStatus(selectedRequest.id, 'rejected')} disabled={updating} className="flex-1 bg-red-500 hover:bg-red-400">
                    ❌ Reject
                  </Button>
                </>
              )}
              {selectedRequest.status === 'in_progress' && (
                <Button onClick={() => updateStatus(selectedRequest.id, 'completed')} disabled={updating} className="flex-1 bg-emerald-500 hover:bg-emerald-400">
                  {updating ? 'Updating...' : '✅ Mark Complete'}
                </Button>
              )}
              {(selectedRequest.status === 'completed' || selectedRequest.status === 'rejected') && (
                <p className="text-slate-400 text-sm">This request has been {selectedRequest.status}.</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
