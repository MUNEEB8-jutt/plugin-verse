import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()

  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: pluginsCount } = await supabase
    .from('plugins')
    .select('*', { count: 'exact', head: true })

  const { count: pendingDepositsCount } = await supabase
    .from('deposits')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return {
    usersCount: usersCount || 0,
    pluginsCount: pluginsCount || 0,
    pendingDepositsCount: pendingDepositsCount || 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <AdminNav />
          
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Admin Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-slate-400 text-sm mb-1">Total Users</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.usersCount}</p>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🔌</div>
                <p className="text-slate-400 text-sm mb-1">Total Plugins</p>
                <p className="text-2xl font-bold text-blue-400">{stats.pluginsCount}</p>
              </div>

              
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">⏳</div>
                <p className="text-slate-400 text-sm mb-1">Pending Deposits</p>
                <p className="text-2xl font-bold text-amber-400">{stats.pendingDepositsCount}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/admin/plugins" className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors">
                  <span className="text-2xl">🔌</span>
                  <div>
                    <p className="font-medium text-white">Manage Plugins</p>
                    <p className="text-sm text-slate-400">Add, edit or remove plugins</p>
                  </div>
                </Link>
                
                <Link href="/admin/deposits" className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="font-medium text-white">Review Deposits</p>
                    <p className="text-sm text-slate-400">{stats.pendingDepositsCount} pending</p>
                  </div>
                </Link>
                
                <Link href="/admin/settings" className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="font-medium text-white">Settings</p>
                    <p className="text-sm text-slate-400">Payment configuration</p>
                  </div>
                </Link>
                
                <Link href="/" className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <p className="font-medium text-white">View Site</p>
                    <p className="text-sm text-slate-400">Go to homepage</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
