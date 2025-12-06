import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { formatDate } from '@/lib/utils/helpers'
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
    .select(`*, plugin:plugins(*)`)
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
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} isAdmin={isAdmin} />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">My Plugins</h1>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/deposit" className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium rounded-xl transition-all text-center text-sm">
                💰 Add Coins
              </Link>
              <Link href="/" className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors text-center text-sm">
                🔍 Browse
              </Link>
            </div>
          </div>


          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-1">📦</div>
              <div className="text-slate-400 text-xs sm:text-sm">Plugins</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-400">{purchases.length}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-1">💰</div>
              <div className="text-slate-400 text-xs sm:text-sm">Balance</div>
              <div className="text-lg sm:text-xl font-bold text-amber-400">{userData?.balance || 0}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-1">💸</div>
              <div className="text-slate-400 text-xs sm:text-sm">Spent</div>
              <div className="text-lg sm:text-xl font-bold text-blue-400">
                {purchases.reduce((acc: number, p: any) => acc + (p.plugin?.price_coins || 0), 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Plugins Grid */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {purchases.map((purchase: any) => (
              <div key={purchase.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-colors group">
                {/* Logo */}
                <div className="relative w-full aspect-square bg-slate-900">
                  <Image
                    src={purchase.plugin.logo_url}
                    alt={purchase.plugin.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {purchase.plugin.price_coins === 0 && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      FREE
                    </span>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-1 mb-1">
                    {purchase.plugin.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    {formatDate(purchase.purchased_at)}
                  </p>
                  <a
                    href={`/api/download/${purchase.plugin.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-medium rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 sm:p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-slate-400 mb-4">No plugins purchased yet</p>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium rounded-xl transition-all">
              Browse Plugins
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
