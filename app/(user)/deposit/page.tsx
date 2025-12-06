'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
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
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} isAdmin={isAdmin} />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            💰 Deposit Coins
          </h1>

          {success ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">
                Deposit Request Submitted!
              </h2>
              <p className="text-slate-400">
                Your request is pending admin approval. You&apos;ll receive coins once approved.
              </p>
            </div>
          ) : (
            <>
              {/* Instructions Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-amber-400 mb-4">
                  📋 How to Deposit
                </h2>
                <div className="space-y-2 text-slate-400 text-sm">
                  <p>1. Select your payment method</p>
                  <p>2. Send payment to the displayed number</p>
                  <p>3. Enter your transaction ID</p>
                  <p>4. Upload payment screenshot</p>
                  <p>5. Submit and wait for approval</p>
                  <p className="text-emerald-400 mt-3">
                    ⏱️ Coins will be added within minutes after approval!
                  </p>
                </div>
              </div>

              {/* Deposit Form */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Amount (Coins)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      min="1"
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-3">
                      {['Easypaisa', 'JazzCash', 'UPI'].map((method) => (
                        <label 
                          key={method}
                          className={`flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                            formData.method === method 
                              ? 'bg-slate-700/50 border-2 border-blue-500/50' 
                              : 'bg-slate-900/50 border border-slate-700/50 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="method"
                              value={method}
                              checked={formData.method === method}
                              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                              className="w-4 h-4 text-blue-500"
                            />
                            <span className="text-white font-medium">{method}</span>
                          </div>
                          {formData.method === method && (
                            <div className="mt-3 ml-7 p-3 bg-slate-800/50 rounded-lg">
                              <p className="text-slate-400 text-xs mb-1">Send payment to:</p>
                              <p className="text-emerald-400 font-semibold">
                                {getPaymentNumber()}
                              </p>
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      required
                      placeholder="Enter transaction ID from receipt"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    />
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Payment Screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white file:font-medium hover:file:bg-slate-600 transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Upload a clear screenshot of your payment confirmation
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
                
                {/* Back Link */}
                <div className="text-center mt-6">
                  <a href="/account" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">
                    ← Back to Dashboard
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
