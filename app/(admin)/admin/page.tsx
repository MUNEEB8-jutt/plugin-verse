import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/helpers'

async function getStats() {
  const supabase = await createClient()

  // Get total users count
  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  // Get total plugins count
  const { count: pluginsCount } = await supabase
    .from('plugins')
    .select('*', { count: 'exact', head: true })

  // Get pending deposits count
  const { count: pendingDepositsCount } = await supabase
    .from('deposits')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Get recent purchases
  const { data: recentPurchases } = await supabase
    .from('purchases')
    .select(`
      *,
      plugin:plugins(title)
    `)
    .order('purchased_at', { ascending: false })
    .limit(5)

  // Get recent deposits
  const { data: recentDeposits } = await supabase
    .from('deposits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    usersCount: usersCount || 0,
    pluginsCount: pluginsCount || 0,
    pendingDepositsCount: pendingDepositsCount || 0,
    recentPurchases: recentPurchases || [],
    recentDeposits: recentDeposits || [],
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <AdminNav />
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'monospace', color: '#ca8a04' }}>
            ⚙️ Admin Panel
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded text-center" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
              <p style={{ color: '#9ca3af', fontFamily: 'monospace', marginBottom: '8px' }}>Total Users</p>
              <p className="text-3xl font-bold" style={{ color: '#4ade80', fontFamily: 'monospace' }}>{stats.usersCount}</p>
            </div>
            
            <div className="p-6 rounded text-center" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
              <p style={{ color: '#9ca3af', fontFamily: 'monospace', marginBottom: '8px' }}>Total Plugins</p>
              <p className="text-3xl font-bold" style={{ color: '#4ade80', fontFamily: 'monospace' }}>{stats.pluginsCount}</p>
            </div>
            
            <div className="p-6 rounded text-center" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
              <p style={{ color: '#9ca3af', fontFamily: 'monospace', marginBottom: '8px' }}>Pending Deposits</p>
              <p className="text-3xl font-bold" style={{ color: '#ca8a04', fontFamily: 'monospace' }}>{stats.pendingDepositsCount}</p>
            </div>
          </div>

          {/* Deposit Requests Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace', color: '#ca8a04' }}>
              💸 Deposit Requests
            </h2>
            
            <div className="p-8 rounded-lg text-center" style={{ backgroundColor: '#1f2937', border: '2px solid #374151' }}>
              {stats.pendingDepositsCount > 0 ? (
                <div>
                  <p className="text-xl mb-4" style={{ color: '#ca8a04', fontFamily: 'monospace' }}>
                    {stats.pendingDepositsCount} pending deposit{stats.pendingDepositsCount > 1 ? 's' : ''}
                  </p>
                  <Link href="/admin/deposits">
                    <button 
                      className="px-8 py-3 rounded font-bold"
                      style={{ backgroundColor: '#ca8a04', color: 'black', fontFamily: 'monospace' }}
                    >
                      REVIEW DEPOSITS
                    </button>
                  </Link>
                </div>
              ) : (
                <p style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
                  No pending deposits
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
