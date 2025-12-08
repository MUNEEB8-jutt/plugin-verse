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
    easypaisa_qr: '',
    jazzcash_qr: '',
    upi_qr: '',
  })
  const [uploadingQr, setUploadingQr] = useState<string | null>(null)
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
          easypaisa_qr: settingsObj.easypaisa_qr || '',
          jazzcash_qr: settingsObj.jazzcash_qr || '',
          upi_qr: settingsObj.upi_qr || '',
        })
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleQrUpload = async (file: File, type: string) => {
    setUploadingQr(type)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      const response = await fetch('/api/settings/qr-upload', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      if (response.ok && data.url) {
        setSettings(prev => ({ ...prev, [`${type}_qr`]: data.url }))
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || 'Failed to upload QR code')
      }
    } catch (err) {
      setError('Failed to upload QR code')
    } finally {
      setUploadingQr(null)
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
                {/* Easypaisa */}
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-3">💚 Easypaisa</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Number</label>
                      <input
                        type="text"
                        value={settings.easypaisa_number}
                        onChange={(e) => setSettings({ ...settings, easypaisa_number: e.target.value })}
                        placeholder="03001234567"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">QR Code (Optional)</label>
                      <div className="flex items-center gap-3">
                        {settings.easypaisa_qr && (
                          <img src={settings.easypaisa_qr} alt="Easypaisa QR" className="w-16 h-16 rounded-lg object-cover border border-slate-600" />
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-center text-sm text-slate-300 transition-colors">
                            {uploadingQr === 'easypaisa' ? 'Uploading...' : settings.easypaisa_qr ? 'Change QR' : 'Upload QR'}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleQrUpload(e.target.files[0], 'easypaisa')}
                            disabled={uploadingQr !== null}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* JazzCash */}
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-red-400 mb-3">❤️ JazzCash</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Number</label>
                      <input
                        type="text"
                        value={settings.jazzcash_number}
                        onChange={(e) => setSettings({ ...settings, jazzcash_number: e.target.value })}
                        placeholder="03001234567"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">QR Code (Optional)</label>
                      <div className="flex items-center gap-3">
                        {settings.jazzcash_qr && (
                          <img src={settings.jazzcash_qr} alt="JazzCash QR" className="w-16 h-16 rounded-lg object-cover border border-slate-600" />
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-center text-sm text-slate-300 transition-colors">
                            {uploadingQr === 'jazzcash' ? 'Uploading...' : settings.jazzcash_qr ? 'Change QR' : 'Upload QR'}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleQrUpload(e.target.files[0], 'jazzcash')}
                            disabled={uploadingQr !== null}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UPI */}
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-purple-400 mb-3">💜 UPI</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">UPI ID</label>
                      <input
                        type="text"
                        value={settings.upi_id}
                        onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                        placeholder="example@upi"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">QR Code (Optional)</label>
                      <div className="flex items-center gap-3">
                        {settings.upi_qr && (
                          <img src={settings.upi_qr} alt="UPI QR" className="w-16 h-16 rounded-lg object-cover border border-slate-600" />
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-center text-sm text-slate-300 transition-colors">
                            {uploadingQr === 'upi' ? 'Uploading...' : settings.upi_qr ? 'Change QR' : 'Upload QR'}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleQrUpload(e.target.files[0], 'upi')}
                            disabled={uploadingQr !== null}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
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
