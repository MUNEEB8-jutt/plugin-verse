'use client'

import { useState, useEffect } from 'react'
import { AdminNav } from '@/components/AdminNav'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    easypaisa_number: '',
    jazzcash_number: '',
    upi_id: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (response.ok) {
        const settingsObj: any = {}
        data.data?.forEach((setting: any) => {
          settingsObj[setting.key] = setting.value
        })
        setSettings({
          easypaisa_number: settingsObj.easypaisa_number || '',
          jazzcash_number: settingsObj.jazzcash_number || '',
          upi_id: settingsObj.upi_id || '',
        })
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to update settings')
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setSaving(false)
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

          <div className="flex-1 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Payment Settings</h1>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 sm:p-6">
              <p className="text-slate-400 text-sm mb-6">
                Configure payment receiver numbers. Users will see these when making deposits.
              </p>

              {success && (
                <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Settings saved successfully!
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Easypaisa Number</label>
                  <input
                    type="text"
                    value={settings.easypaisa_number}
                    onChange={(e) => setSettings({ ...settings, easypaisa_number: e.target.value })}
                    placeholder="03001234567"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">Users will send Easypaisa payments here</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">JazzCash Number</label>
                  <input
                    type="text"
                    value={settings.jazzcash_number}
                    onChange={(e) => setSettings({ ...settings, jazzcash_number: e.target.value })}
                    placeholder="03001234567"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">Users will send JazzCash payments here</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={settings.upi_id}
                    onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                    placeholder="example@upi"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">Users will send UPI payments here</p>
                </div>

                <Button type="submit" disabled={saving} className="w-full py-3">
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
