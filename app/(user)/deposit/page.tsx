'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export default function DepositPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [settings, setSettings] = useState<any>({})
  const [formData, setFormData] = useState({
    amount: '',
    method: 'Easypaisa',
    transactionId: '',
  })
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    checkUser()
    fetchSettings()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      setIsAdmin(user.user_metadata?.role === 'admin')
    } else {
      router.push('/login')
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (response.ok) {
        const settingsObj: any = {}
        data.data?.forEach((setting: any) => {
          settingsObj[setting.key] = setting.value
        })
        setSettings(settingsObj)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!screenshot) {
      setError('Please upload a payment screenshot')
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('amount', formData.amount)
      formDataToSend.append('method', formData.method)
      formDataToSend.append('transactionId', formData.transactionId)
      formDataToSend.append('screenshot', screenshot)

      const response = await fetch('/api/deposits', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit deposit request')
        setLoading(false)
        return
      }

      setSuccess(true)
      setFormData({ amount: '', method: 'Easypaisa', transactionId: '' })
      setScreenshot(null)

      setTimeout(() => {
        router.push('/account')
      }, 2000)
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentNumber = () => {
    switch (formData.method) {
      case 'Easypaisa':
        return settings.easypaisa_number || 'Not configured'
      case 'JazzCash':
        return settings.jazzcash_number || 'Not configured'
      case 'UPI':
        return settings.upi_id || 'Not configured'
      default:
        return ''
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-40 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="text-2xl font-bold text-accent-primary hover:brightness-110">
              PluginVerse
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-text-primary hover:text-accent-primary">
                Marketplace
              </a>
              <a href="/account" className="text-text-primary hover:text-accent-primary">
                Dashboard
              </a>
              <a href="/deposit" className="text-accent-primary font-semibold">
                Add Coins
              </a>
              {isAdmin && (
                <a href="/admin" className="text-accent-secondary hover:brightness-110">
                  Admin Panel
                </a>
              )}
              <button
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.auth.signOut()
                  router.push('/login')
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:brightness-110"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'monospace', color: '#ca8a04' }}>
            💰 Deposit Coins
          </h1>

          {success ? (
            <div className="p-8 rounded-lg text-center" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#4ade80', fontFamily: 'monospace' }}>
                Deposit Request Submitted!
              </h2>
              <p style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
                Your request is pending admin approval. You'll receive coins once approved.
              </p>
            </div>
          ) : (
            <>
              {/* Instructions Card */}
              <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: '#ca8a04', fontFamily: 'monospace' }}>
                  📋 Instructions
                </h2>
                <div className="space-y-3" style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '14px' }}>
                  <p>✅ Step 1: Select your payment method (Easypaisa, JazzCash, or UPI)</p>
                  <p>✅ Step 2: Send payment to the displayed number</p>
                  <p>✅ Step 3: Enter your transaction ID from payment receipt</p>
                  <p>✅ Step 4: Upload screenshot of your payment</p>
                  <p>✅ Step 5: Submit and wait for admin approval</p>
                  <p style={{ color: '#4ade80', marginTop: '12px' }}>
                    ⏱️ You will receive your coins within a few minutes after approval!
                  </p>
                </div>
              </div>

              {/* Deposit Form */}
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block font-medium mb-2" style={{ fontFamily: 'monospace', color: '#d1d5db' }}>
                      Amount (Coins)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      min="1"
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 rounded focus:outline-none"
                      style={{ 
                        backgroundColor: '#1f2937', 
                        border: '2px solid #374151',
                        color: '#9ca3af',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block font-medium mb-2" style={{ fontFamily: 'monospace', color: '#d1d5db' }}>
                      Payment Method
                    </label>
                    <div className="space-y-3">
                      <label 
                        className="flex flex-col px-4 py-4 rounded cursor-pointer transition-all"
                        style={{ 
                          backgroundColor: formData.method === 'Easypaisa' ? '#1f2937' : '#111827',
                          border: '2px solid ' + (formData.method === 'Easypaisa' ? '#3b82f6' : '#374151')
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="method"
                            value="Easypaisa"
                            checked={formData.method === 'Easypaisa'}
                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                            className="w-5 h-5"
                          />
                          <span style={{ fontFamily: 'monospace', fontSize: '18px', color: 'white' }}>Easypaisa</span>
                        </div>
                        {formData.method === 'Easypaisa' && (
                          <div className="mt-2 ml-8 p-2 rounded" style={{ backgroundColor: '#111827' }}>
                            <p style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'monospace' }}>Send payment to:</p>
                            <p style={{ color: '#4ade80', fontSize: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                              {getPaymentNumber()}
                            </p>
                          </div>
                        )}
                      </label>
                      
                      <label 
                        className="flex flex-col px-4 py-4 rounded cursor-pointer transition-all"
                        style={{ 
                          backgroundColor: formData.method === 'JazzCash' ? '#1f2937' : '#111827',
                          border: '2px solid ' + (formData.method === 'JazzCash' ? '#3b82f6' : '#374151')
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="method"
                            value="JazzCash"
                            checked={formData.method === 'JazzCash'}
                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                            className="w-5 h-5"
                          />
                          <span style={{ fontFamily: 'monospace', fontSize: '18px', color: 'white' }}>JazzCash</span>
                        </div>
                        {formData.method === 'JazzCash' && (
                          <div className="mt-2 ml-8 p-2 rounded" style={{ backgroundColor: '#111827' }}>
                            <p style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'monospace' }}>Send payment to:</p>
                            <p style={{ color: '#4ade80', fontSize: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                              {getPaymentNumber()}
                            </p>
                          </div>
                        )}
                      </label>
                      
                      <label 
                        className="flex flex-col px-4 py-4 rounded cursor-pointer transition-all"
                        style={{ 
                          backgroundColor: formData.method === 'UPI' ? '#1f2937' : '#111827',
                          border: '2px solid ' + (formData.method === 'UPI' ? '#3b82f6' : '#374151')
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="method"
                            value="UPI"
                            checked={formData.method === 'UPI'}
                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                            className="w-5 h-5"
                          />
                          <span style={{ fontFamily: 'monospace', fontSize: '18px', color: 'white' }}>UPI</span>
                        </div>
                        {formData.method === 'UPI' && (
                          <div className="mt-2 ml-8 p-2 rounded" style={{ backgroundColor: '#111827' }}>
                            <p style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'monospace' }}>Send payment to:</p>
                            <p style={{ color: '#4ade80', fontSize: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                              {getPaymentNumber()}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block font-medium mb-2" style={{ fontFamily: 'monospace', color: '#d1d5db' }}>
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      required
                      placeholder="Enter transaction ID"
                      className="w-full px-4 py-3 rounded focus:outline-none"
                      style={{ 
                        backgroundColor: '#1f2937', 
                        border: '2px solid #374151',
                        color: '#9ca3af',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment Screenshot *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      required
                      className="w-full px-4 py-2 bg-bg-secondary border border-border rounded"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Upload a clear screenshot of your payment confirmation
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded font-bold transition-all"
                    style={{ 
                      backgroundColor: '#ca8a04',
                      color: 'black',
                      fontFamily: 'monospace',
                      fontSize: '18px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                  </button>
                </form>
                
                {/* Back to Profile Link */}
                <div className="text-center mt-6">
                  <a 
                    href="/account" 
                    className="inline-flex items-center gap-2 transition-all"
                    style={{ color: '#9ca3af', fontFamily: 'monospace' }}
                  >
                    ← Back to Profile
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
