'use client'

import { useState, useEffect } from 'react'
import { AdminNav } from '@/components/AdminNav'
import { Card } from '@/components/ui/Card'
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
        setSaving(false)
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('An error occurred')
    } finally {
      setSaving(false)
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

        <div className="flex-1 max-w-2xl">
          <h1 className="text-3xl font-bold text-accent-primary mb-6">Payment Settings</h1>

          <Card>
            <p className="text-text-secondary mb-6">
              Configure payment receiver numbers for deposit requests. Users will see these numbers when making deposits.
            </p>

            {success && (
              <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
                Settings updated successfully!
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Easypaisa Number"
                  value={settings.easypaisa_number}
                  onChange={(e) =>
                    setSettings({ ...settings, easypaisa_number: e.target.value })
                  }
                  placeholder="03001234567"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Users will send Easypaisa payments to this number
                </p>
              </div>

              <div>
                <Input
                  label="JazzCash Number"
                  value={settings.jazzcash_number}
                  onChange={(e) =>
                    setSettings({ ...settings, jazzcash_number: e.target.value })
                  }
                  placeholder="03001234567"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Users will send JazzCash payments to this number
                </p>
              </div>

              <div>
                <Input
                  label="UPI ID"
                  value={settings.upi_id}
                  onChange={(e) =>
                    setSettings({ ...settings, upi_id: e.target.value })
                  }
                  placeholder="example@upi"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Users will send UPI payments to this ID
                </p>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
