'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'

interface PurchaseButtonProps {
  pluginId: string
}

export function PurchaseButton({ pluginId }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/plugins/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Purchase failed')
        setLoading(false)
        return
      }

      alert('Purchase successful! You can now download the plugin.')
      router.refresh()
    } catch (err) {
      alert('An error occurred during purchase')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Processing...' : 'Purchase Plugin'}
    </Button>
  )
}
