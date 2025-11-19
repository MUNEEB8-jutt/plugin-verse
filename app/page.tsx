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
  description: "🎮 Pakistan's leading Minecraft plugin marketplace! 💎 Download premium & free plugins/mods with coins. 🇵🇰 Trusted by Pakistani Minecraft community. پاکستان میں مائن کرافٹ پلگ انز اور موڈز کی بہترین مارکیٹ",
  keywords: "PluginVerse Pakistan, Minecraft plugins Pakistan, Minecraft mods Pakistan, Pakistan plugin marketplace, Minecraft server plugins PK, Free Minecraft mods Pakistan, Premium plugins Pakistan, plugin store Pakistan, Minecraft موڈز پاکستان, مائن کرافٹ پلگ انز, buy minecraft plugins pakistan, download minecraft mods pakistan",
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

  // Structured Data for SEO
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

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/logo.png`}
                alt="PluginVerse Logo"
                className="w-20 h-20 object-contain animate-bounce-slow"
                style={{ imageRendering: 'pixelated' }}
              />
              <h1
                className="text-6xl font-bold"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#4ade80',
                  textShadow: '4px 4px 0 #000'
                }}
              >
                PluginVerse
              </h1>
            </div>

            <div
              className="p-6 mb-8 relative overflow-hidden border-4 border-black"
              style={{
                background: 'linear-gradient(180deg, #57534e 0%, #44403c 100%)',
                boxShadow: '8px 8px 0 #000, inset 0 2px 0 rgba(255,255,255,0.2)'
              }}
            >
              {/* Grass texture overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'url(/textures/grass.png)',
                  backgroundSize: '64px 64px',
                  imageRendering: 'pixelated'
                }}
              />
              <div className="relative z-10">
                <h2
                  className="text-2xl font-semibold mb-2"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    color: '#a8a29e',
                    textShadow: '2px 2px 0 #000'
                  }}
                >
                  Minecraft Plugins & Mods
                </h2>
                <p
                  className="text-lg mb-6"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.8rem',
                    color: '#78716c',
                    textShadow: '1px 1px 0 #000'
                  }}
                >
                  🔍 Discover premium plugins
                </p>

                {/* Action Buttons - Improved */}
                <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                  {user && (
                    <a
                      href="/account"
                      className="px-6 py-3 font-bold transition-all border-4 border-black bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] text-white shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[1px_1px_0_#000] active:translate-x-[1px] active:translate-y-[1px]"
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.7rem'
                      }}
                    >
                      📊 My Dashboard
                    </a>
                  )}
                  <a
                    href="/deposit"
                    className="px-6 py-3 font-bold transition-all border-4 border-black bg-gradient-to-b from-[#f59e0b] to-[#d97706] text-black shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[1px_1px_0_#000] active:translate-x-[1px] active:translate-y-[1px]"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '0.7rem'
                    }}
                  >
                    💰 Add Coins
                  </a>
                </div>

                {/* Social Buttons - Improved */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <a
                    href="https://discord.com/invite/UnDRjTc9jP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 font-bold transition-all flex items-center gap-2 border-4 border-black bg-gradient-to-b from-[#5865F2] to-[#4752C4] text-white shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px]"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem' }}
                  >
                    <span>💬</span> Join Discord
                  </a>
                  <a
                    href="https://www.youtube.com/@ItxMuneebYT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 font-bold transition-all flex items-center gap-2 border-4 border-black bg-gradient-to-b from-[#FF0000] to-[#CC0000] text-white shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px]"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem' }}
                  >
                    <span>▶️</span> Subscribe
                  </a>
                </div>
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
