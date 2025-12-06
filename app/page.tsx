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
  title: "PluginVerse Pakistan - #1 Minecraft Plugins & Mods Marketplace | Premium Plugin Store",
  description: "🎮 Pakistan's leading Minecraft plugin marketplace! 💎 Download premium & free plugins/mods with coins. 🇵🇰 Trusted by Pakistani Minecraft community.",
  keywords: "PluginVerse Pakistan, Minecraft plugins Pakistan, Minecraft mods Pakistan, Pakistan plugin marketplace, Minecraft server plugins PK, Free Minecraft mods Pakistan, Premium plugins Pakistan, plugin store Pakistan, buy minecraft plugins pakistan, download minecraft mods pakistan, Pakistan Minecraft server, Minecraft community Pakistan",
  openGraph: {
    title: "PluginVerse Pakistan - #1 Minecraft Plugins & Mods Marketplace",
    description: "🎮 Pakistan's leading Minecraft plugin marketplace! 💎 Premium & Free plugins. 💰 Coin-based system. 🇵🇰 Made for Pakistani Minecraft community.",
    url: "https://pluginverse.vercel.app",
    type: "website",
    locale: "en_PK",
    alternateLocale: ["ur_PK"],
    images: [{
      url: "https://pluginverse.vercel.app/logo.png",
      width: 1200,
      height: 630,
      alt: "PluginVerse Pakistan - Minecraft Plugin Marketplace"
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

        <main className="container mx-auto px-4 py-8 md:py-12">
          {/* Hero Section */}
          <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/logo.png`}
                alt="PluginVerse Logo"
                className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-2xl shadow-lg"
                loading="eager"
                fetchPriority="high"
              />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                PluginVerse
              </h1>
            </div>

            <p className="text-slate-400 text-base md:text-lg mb-6 max-w-2xl mx-auto">
              Pakistan&apos;s #1 Minecraft Plugin Marketplace
            </p>

            {/* Hero Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-8 max-w-3xl mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
                Minecraft Plugins & Mods
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-6">
                🔍 Discover premium plugins for your server
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                {user && (
                  <a
                    href="/account"
                    className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    📊 My Dashboard
                  </a>
                )}
                <a
                  href="/deposit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  💰 Add Coins
                </a>
              </div>

              {/* Social Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://discord.com/invite/UnDRjTc9jP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  💬 Join Discord
                </a>
                <a
                  href="https://www.youtube.com/@ItxMuneebYT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  ▶️ Subscribe
                </a>
              </div>
            </div>
          </div>

          {/* Plugins Grid with Search */}
          <HomePageClient plugins={plugins} purchasedPluginIds={purchasedPluginIds} />
        </main>
      </div>
    </>
  )
}
