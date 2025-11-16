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
    if (!confirm('Are you sure you want to approve this deposit?')) return

    try {
      const response = await fetch(`/api/deposits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })

      if (response.ok) {
        alert('Deposit approved successfully!')
        fetchDeposits()
        setShowModal(false)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to approve deposit')
      }
    } catch (err) {
      alert('An error occurred')
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this deposit?')) return

    try {
      const response = await fetch(`/api/deposits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })

      if (response.ok) {
        alert('Deposit rejected')
        fetchDeposits()
        setShowModal(false)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to reject deposit')
      }
    } catch (err) {
      alert('An error occurred')
    }
  }

  const viewDetails = (deposit: Deposit) => {
    setSelectedDeposit(deposit)
    setShowModal(true)
  }

  const filteredDeposits = deposits.filter((deposit) => {
    if (filter === 'all') return true
    return deposit.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400'
      case 'approved':
        return 'text-green-400'
      case 'rejected':
        return 'text-red-400'
      default:
        return 'text-text-secondary'
    }
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
            <h1 className="text-3xl font-bold text-accent-primary">Deposit Requests</h1>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded ${
                  filter === 'all'
                    ? 'bg-accent-primary text-bg-primary'
                    : 'bg-bg-secondary text-text-primary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded ${
                  filter === 'pending'
                    ? 'bg-accent-primary text-bg-primary'
                    : 'bg-bg-secondary text-text-primary'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded ${
                  filter === 'approved'
                    ? 'bg-accent-primary text-bg-primary'
                    : 'bg-bg-secondary text-text-primary'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded ${
                  filter === 'rejected'
                    ? 'bg-accent-primary text-bg-primary'
                    : 'bg-bg-secondary text-text-primary'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="glass rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((deposit) => (
                  <tr key={deposit.id} className="border-t border-border">
                    <td className="px-6 py-4 text-sm">
                      {formatDate(deposit.created_at)}
                    </td>
                    <td className="px-6 py-4 text-accent-primary font-bold">
                      {formatCurrency(deposit.amount)}
                    </td>
                    <td className="px-6 py-4">{deposit.method}</td>
                    <td className="px-6 py-4 font-mono text-sm">{deposit.transaction_id}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold capitalize ${getStatusColor(deposit.status)}`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => viewDetails(deposit)}
                          variant="secondary"
                          className="text-sm px-4 py-1"
                        >
                          View
                        </Button>
                        {deposit.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApprove(deposit.id)}
                              className="text-sm px-4 py-1"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(deposit.id)}
                              variant="danger"
                              className="text-sm px-4 py-1"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDeposits.length === 0 && (
              <div className="text-center py-12 text-text-secondary">
                No {filter !== 'all' && filter} deposits found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deposit Details Modal */}
      {selectedDeposit && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedDeposit(null)
          }}
          title="Deposit Details"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary">Amount</p>
              <p className="text-2xl font-bold text-accent-primary">
                {formatCurrency(selectedDeposit.amount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">Payment Method</p>
              <p className="text-lg font-semibold">{selectedDeposit.method}</p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">Transaction ID</p>
              <p className="font-mono">{selectedDeposit.transaction_id}</p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">Status</p>
              <p className={`text-lg font-semibold capitalize ${getStatusColor(selectedDeposit.status)}`}>
                {selectedDeposit.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary mb-2">Payment Screenshot</p>
              <div className="relative w-full h-96 rounded overflow-hidden bg-bg-secondary">
                <Image
                  src={selectedDeposit.screenshot_url}
                  alt="Payment screenshot"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {selectedDeposit.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleApprove(selectedDeposit.id)}
                  className="flex-1"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(selectedDeposit.id)}
                  variant="danger"
                  className="flex-1"
                >
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
