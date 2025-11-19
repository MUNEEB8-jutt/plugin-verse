import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils/helpers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

async function getUserData(userId: string) {
  const supabase = await createClient()
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return user
}

async function getUserPurchases(userId: string) {
  const supabase = await createClient()
  const { data: purchases } = await supabase
    .from('purchases')
    .select(`
      *,
      plugin:plugins(*)
    `)
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false })

  return purchases || []
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.user_metadata?.role === 'admin'
  const userData = await getUserData(user.id)
  const purchases = await getUserPurchases(user.id)

  return (
    <div className="min-h-screen">
      <Navbar user={user} isAdmin={isAdmin} />

      <main className="container mx-auto px-4 py-12 page-transition">
        {/* Dashboard Header */}
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'monospace', color: '#4ade80' }}>
                📊 Dashboard
              </h1>
              <p style={{ color: '#9ca3af', fontFamily: 'monospace' }}>👤 {isAdmin ? 'admin' : 'user'}</p>
              <p style={{ color: '#6b7280', fontFamily: 'monospace', fontSize: '14px' }}>{user.email}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/deposit">
                <button 
                  className="px-6 py-3 rounded font-bold transition-all"
                  style={{ backgroundColor: '#ca8a04', color: 'black', fontFamily: 'monospace' }}
                >
                  💰 DEPOSIT
                </button>
              </Link>
              <Link href="/">
                <button 
                  className="px-6 py-3 rounded font-bold transition-all"
                  style={{ backgroundColor: '#10b981', color: 'black', fontFamily: 'monospace' }}
                >
                  🔍 DISCOVER
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded text-center" style={{ backgroundColor: '#111827', border: '2px solid #374151' }}>
              <div className="text-3xl mb-2">📦</div>
              <div style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '14px' }}>Plugins Owned</div>
              <div className="text-2xl font-bold" style={{ color: '#4ade80', fontFamily: 'monospace' }}>
                {purchases.length}
              </div>
            </div>
            
            <div className="p-4 rounded text-center" style={{ backgroundColor: '#111827', border: '2px solid #374151' }}>
              <div className="text-3xl mb-2">💰</div>
              <div style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '14px' }}>Coins Balance</div>
              <div className="text-2xl font-bold" style={{ color: '#ca8a04', fontFamily: 'monospace' }}>
                {userData?.balance || 0}
              </div>
            </div>
            
            <div className="p-4 rounded text-center" style={{ backgroundColor: '#111827', border: '2px solid #374151' }}>
              <div className="text-3xl mb-2">💸</div>
              <div style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '14px' }}>Deposits Made</div>
              <div className="text-2xl font-bold" style={{ color: '#4ade80', fontFamily: 'monospace' }}>
                0
              </div>
            </div>
          </div>
        </div>

        {/* My Plugins Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace', color: '#4ade80' }}>
            📦 My Plugins
          </h2>
          
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
            {purchases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchases.map((purchase: any) => (
                  <div key={purchase.id} className="p-4 rounded" style={{ backgroundColor: '#111827', border: '2px solid #374151' }}>
                    <div className="relative w-full h-32 mb-3 rounded overflow-hidden" style={{ backgroundColor: '#1f2937' }}>
                      <Image
                        src={purchase.plugin.logo_url}
                        alt={purchase.plugin.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <h3 className="font-bold mb-2" style={{ fontFamily: 'monospace', color: 'white' }}>
                      {purchase.plugin.title}
                    </h3>

                    <p className="text-sm mb-3" style={{ color: '#6b7280', fontFamily: 'monospace' }}>
                      {formatDate(purchase.purchased_at)}
                    </p>

                    <a
                      href={`/api/download/${purchase.plugin.id}`}
                      className="block w-full text-center py-2 rounded font-bold transition-all"
                      style={{ backgroundColor: '#10b981', color: 'black', fontFamily: 'monospace' }}
                    >
                      DOWNLOAD
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="mb-4" style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
                  No plugins purchased yet
                </p>
                <Link href="/">
                  <button 
                    className="px-6 py-3 rounded font-bold transition-all"
                    style={{ backgroundColor: '#10b981', color: 'black', fontFamily: 'monospace' }}
                  >
                    BROWSE PLUGINS
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Deposit History Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace', color: '#ca8a04' }}>
            💸 Deposit History
          </h2>
          
          <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
            <p style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
              No deposits yet
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
