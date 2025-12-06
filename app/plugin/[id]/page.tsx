import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { DownloadButton } from '@/components/DownloadButton'
import { PurchaseButton } from '@/components/PurchaseButton'
import { formatCurrency, formatDate } from '@/lib/utils/helpers'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getPlugin(id: string) {
  const supabase = await createClient()
  const { data: plugin } = await supabase
    .from('plugins')
    .select('*')
    .eq('id', id)
    .single()
  return plugin
}

async function checkPurchase(userId: string, pluginId: string) {
  const supabase = await createClient()
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('plugin_id', pluginId)
    .single()
  return !!purchase
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plugin = await getPlugin(id)
  if (!plugin) return { title: 'Plugin Not Found' }

  return {
    title: `${plugin.title} - ${plugin.price_coins === 0 ? 'Free' : plugin.price_coins + ' Coins'}`,
    description: plugin.description.slice(0, 160),
    openGraph: {
      title: plugin.title,
      description: plugin.description.slice(0, 160),
      images: [plugin.logo_url],
      type: 'website',
    },
  }
}

export default async function PluginDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plugin = await getPlugin(id)
  if (!plugin) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.user_metadata?.role === 'admin'
  const isPurchased = user ? await checkPurchase(user.id, id) : false


  const getPlatformInfo = () => {
    switch (plugin.platform) {
      case 'plugin': return { label: 'Paper/Spigot/Bukkit Plugin', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '📄' }
      case 'mod-fabric': return { label: 'Fabric Mod', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🧵' }
      case 'mod-forge': return { label: 'Forge Mod', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🔨' }
      default: return { label: 'Plugin', color: 'bg-slate-700/50 text-slate-300 border-slate-600/30', icon: '📦' }
    }
  }
  const platformInfo = getPlatformInfo()

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} isAdmin={isAdmin} />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Marketplace
        </Link>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="p-5 sm:p-8 border-b border-slate-700/50">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              {/* Logo */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-700/50 mx-auto sm:mx-0">
                <Image
                  src={plugin.logo_url}
                  alt={plugin.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Title & Meta */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {plugin.title}
                </h1>

                {/* Badges */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                  {/* Platform */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${platformInfo.color}`}>
                    {platformInfo.icon} {platformInfo.label}
                  </span>

                  {/* Version */}
                  {plugin.version && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium border border-slate-600/30">
                      v{plugin.version}
                    </span>
                  )}

                  {/* Price */}
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold border ${
                    plugin.price_coins === 0 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {plugin.price_coins === 0 ? '✨ FREE' : `🪙 ${formatCurrency(plugin.price_coins)}`}
                  </span>
                </div>

                {/* Date */}
                <p className="text-sm text-slate-500">
                  Added on {formatDate(plugin.created_at)}
                </p>
              </div>
            </div>
          </div>


          {/* Description Section */}
          <div className="p-5 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </h2>
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {plugin.description}
              </p>
            </div>
          </div>

          {/* Action Section */}
          <div className="p-5 sm:p-8 bg-slate-900/50 border-t border-slate-700/50">
            <div className="max-w-md mx-auto">
              {user ? (
                isPurchased ? (
                  <div className="space-y-3">
                    <p className="text-center text-emerald-400 text-sm mb-2">✅ You own this plugin</p>
                    <DownloadButton pluginId={plugin.id} pluginTitle={plugin.title} />
                  </div>
                ) : (
                  <PurchaseButton pluginId={plugin.id} isFree={plugin.price_coins === 0} />
                )
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-slate-400">
                    {plugin.price_coins === 0 
                      ? 'Login to download this free plugin'
                      : 'Login to purchase this plugin'}
                  </p>
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500">
                      Login to Continue
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
