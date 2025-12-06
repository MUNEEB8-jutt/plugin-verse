import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { HomePageClient } from '@/components/HomePageClient'

async function getPlugins() {
  const supabase = await createClient()
  const { data: plugins } = await supabase
    .from('plugins')
    .select('*')
    .order('created_at', { ascending: false })

  return plugins || []
}

async function getUserPurchases(userId: string) {
  const supabase = await createClient()
  const { data: purchases } = await supabase
    .from('purchases')
    .select('plugin_id')
    .eq('user_id', userId)

  return purchases?.map(p => p.plugin_id) || []
}

export const metadata = {
  title: "PluginVerse - Best Minecraft Plugins & Mods | Free Download",
  description: "Download free and premium Minecraft plugins. Best Spigot, Bukkit, Paper plugins for your server. Economy, protection, minigames and more.",
  keywords: "Minecraft plugins, free plugins, Spigot plugins, Bukkit plugins, Paper plugins, server plugins, download mods, plugin marketplace",
  openGraph: {
    title: "PluginVerse - Minecraft Plugins & Mods Marketplace",
    description: "🎮 Best marketplace for Minecraft plugins. 💎 Free & Premium plugins for Spigot, Bukkit, Paper servers.",
    url: "https://pluginverse.vercel.app",
    type: "website",
    images: [{
      url: "https://pluginverse.vercel.app/logo.png",
      width: 1200,
      height: 630,
      alt: "PluginVerse - Minecraft Plugin Marketplace"
    }],
  },
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.user_metadata?.role === 'admin'

  const plugins = await getPlugins()
  const purchasedPluginIds = user ? await getUserPurchases(user.id) : []

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PluginVerse",
    "url": "https://pluginverse.vercel.app",
    "description": "Premium Minecraft Plugin Marketplace with coins system",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://pluginverse.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PluginVerse",
    "url": "https://pluginverse.vercel.app",
    "logo": "https://pluginverse.vercel.app/logo.png",
    "description": "Premium Minecraft Plugin Marketplace",
    "sameAs": [
      "https://discord.com/invite/UnDRjTc9jP",
      "https://www.youtube.com/@ItxMuneebYT"
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <div className="min-h-screen">
        <Navbar user={user} isAdmin={isAdmin} />

        <main className="container mx-auto px-4 py-6 md:py-10">
          {/* Hero Section - Stylish */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
              ✨ Free & Premium Minecraft Plugins
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Discover Premium{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Minecraft Plugins
              </span>
            </h1>

            <p className="text-slate-400 text-base md:text-lg mb-6 max-w-xl mx-auto">
              Browse, purchase and download plugins for your server
            </p>

            {/* Action Buttons - Stylish */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {user && (
                <a
                  href="/account"
                  className="group px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-slate-900/50 border border-slate-600/50 flex items-center gap-2 text-sm"
                >
                  <span className="group-hover:scale-110 transition-transform">📊</span> Dashboard
                </a>
              )}
              <a
                href="/deposit"
                className="group px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2 text-sm"
              >
                <span className="group-hover:scale-110 transition-transform">💰</span> Add Coins
              </a>
              <a
                href="https://discord.com/invite/UnDRjTc9jP"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-5 py-2.5 bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#6875F3] hover:to-[#5865F2] text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 text-sm"
              >
                <span className="group-hover:scale-110 transition-transform">💬</span> Discord
              </a>
              <a
                href="https://www.youtube.com/@ItxMuneebYT"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-500/30 flex items-center gap-2 text-sm"
              >
                <span className="group-hover:scale-110 transition-transform">▶️</span> YouTube
              </a>
            </div>
          </div>

          {/* Plugins Grid with Search */}
          <HomePageClient plugins={plugins} purchasedPluginIds={purchasedPluginIds} />
        </main>
      </div>
    </>
  )
}
