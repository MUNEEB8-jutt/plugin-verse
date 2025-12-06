import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
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

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Dashboard Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                📊 Dashboard
              </h1>
              <p className="text-slate-400 text-sm">
                {isAdmin ? '👑 Admin' : '👤 User'} • {user.email}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/deposit">
                <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-amber-500/25">
                  💰 Deposit
                </button>
              </Link>
              <Link href="/">
                <button className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors">
                  🔍 Browse
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-slate-400 text-sm mb-1">Plugins Owned</div>
              <div className="text-2xl font-bold text-emerald-400">
                {purchases.length}
              </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-slate-400 text-sm mb-1">Coins Balance</div>
              <div className="text-2xl font-bold text-amber-400">
                {userData?.balance || 0}
              </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">💸</div>
              <div className="text-slate-400 text-sm mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-blue-400">
                {purchases.reduce((acc: number, p: any) => acc + (p.plugin?.price_coins || 0), 0)}
              </div>
            </div>
          </div>
        </div>

        {/* My Plugins Section */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            📦 My Plugins
          </h2>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            {purchases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchases.map((purchase: any) => (
                  <div key={purchase.id} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors">
                    <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-slate-800">
                      <Image
                        src={purchase.plugin.logo_url}
                        alt={purchase.plugin.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <h3 className="font-semibold text-white mb-1 line-clamp-1">
                      {purchase.plugin.title}
                    </h3>

                    <p className="text-sm text-slate-500 mb-3">
                      {formatDate(purchase.purchased_at)}
                    </p>

                    <a
                      href={`/api/download/${purchase.plugin.id}`}
                      className="block w-full text-center py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/25"
                    >
                      📥 Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 mb-4">
                  No plugins purchased yet
                </p>
                <Link href="/">
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/25">
                    Browse Plugins
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
