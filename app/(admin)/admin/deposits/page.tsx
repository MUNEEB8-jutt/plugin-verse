'use client'

import { useState, useEffect } from 'react'
import { AdminNav } from '@/components/AdminNav'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Deposit } from '@/lib/types/database'
import { formatCurrency, formatDate } from '@/lib/utils/helpers'
import Image from 'next/image'

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    try {
      const response = await fetch('/api/deposits')
      const data = await response.json()
      if (response.ok) {
        setDeposits(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch deposits:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this deposit?')) return
    try {
      const response = await fetch(`/api/deposits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
      if (response.ok) {
        fetchDeposits()
        setShowModal(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Reject this deposit?')) return
    try {
      const response = await fetch(`/api/deposits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })
      if (response.ok) {
        fetchDeposits()
        setShowModal(false)
      }
    } catch (err) {
      console.error(err)
    }
  }


  const filteredDeposits = deposits.filter((d) => filter === 'all' || d.status === filter)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Deposits</h1>
              
              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredDeposits.map((deposit) => (
                <div key={deposit.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-amber-400">{formatCurrency(deposit.amount)}</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusStyle(deposit.status)}`}>
                      {deposit.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-slate-400 mb-4">
                    <p>Method: <span className="text-white">{deposit.method}</span></p>
                    <p>TxID: <span className="text-white font-mono text-xs">{deposit.transaction_id}</span></p>
                    <p>Date: <span className="text-white">{formatDate(deposit.created_at)}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedDeposit(deposit); setShowModal(true) }} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">
                      View
                    </button>
                    {deposit.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(deposit.id)} className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm">
                          Approve
                        </button>
                        <button onClick={() => handleReject(deposit.id)} className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>


            {/* Desktop Table */}
            <div className="hidden md:block bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Method</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">TxID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredDeposits.map((deposit) => (
                      <tr key={deposit.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3 text-sm text-slate-300">{formatDate(deposit.created_at)}</td>
                        <td className="px-4 py-3 font-bold text-amber-400">{formatCurrency(deposit.amount)}</td>
                        <td className="px-4 py-3 text-slate-300">{deposit.method}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{deposit.transaction_id}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusStyle(deposit.status)}`}>
                            {deposit.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedDeposit(deposit); setShowModal(true) }} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            {deposit.status === 'pending' && (
                              <>
                                <button onClick={() => handleApprove(deposit.id)} className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </button>
                                <button onClick={() => handleReject(deposit.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredDeposits.length === 0 && (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <p className="text-slate-400">No {filter !== 'all' ? filter : ''} deposits found</p>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Modal */}
      {selectedDeposit && (
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSelectedDeposit(null) }} title="Deposit Details">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Amount</p>
                <p className="text-xl font-bold text-amber-400">{formatCurrency(selectedDeposit.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Status</p>
                <span className={`inline-block px-2 py-1 rounded-lg text-sm font-medium border ${getStatusStyle(selectedDeposit.status)}`}>
                  {selectedDeposit.status}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-slate-400">Method</p>
              <p className="text-white">{selectedDeposit.method}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-400">Transaction ID</p>
              <p className="font-mono text-sm text-white break-all">{selectedDeposit.transaction_id}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-2">Screenshot</p>
              <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-800">
                <Image src={selectedDeposit.screenshot_url} alt="Payment screenshot" fill className="object-contain" />
              </div>
            </div>

            {selectedDeposit.status === 'pending' && (
              <div className="flex gap-3 pt-2">
                <Button onClick={() => handleApprove(selectedDeposit.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-400">
                  Approve
                </Button>
                <Button onClick={() => handleReject(selectedDeposit.id)} variant="danger" className="flex-1">
                  Reject
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
