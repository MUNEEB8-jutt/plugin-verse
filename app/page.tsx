import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { PluginCard } from '@/components/PluginCard'
import { Plugin } from '@/lib/types/database'

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
  title: "PluginVerse - Premium Minecraft Plugin Marketplace",
  description: "Discover, purchase and download premium Minecraft plugins with coins. Browse free and paid plugins for your Minecraft server.",
  openGraph: {
    title: "PluginVerse - Premium Minecraft Plugin Marketplace",
    description: "Discover, purchase and download premium Minecraft plugins with coins. Browse free and paid plugins for your Minecraft server.",
    url: "https://pluginverse.vercel.app",
    type: "website",
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
        <div className="text-center mb-12">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/logo.png`}
              alt="PluginVerse Logo"
              className="w-20 h-20 object-contain"
            />
            <h1 className="text-6xl font-bold" style={{ fontFamily: 'monospace', color: '#4ade80' }}>
              PluginVerse
            </h1>
          </div>
          
          <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '2px solid #374151', backdropFilter: 'blur(10px)' }}>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
              Minecraft Plugin Marketplace
            </h2>
            <p className="text-lg mb-6" style={{ color: '#6b7280', fontFamily: 'monospace' }}>
              🔍 Discover and download premium Minecraft plugins
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {user && (
                <a 
                  href="/account"
                  className="px-6 py-3 rounded font-bold transition-all hover:brightness-110"
                  style={{ 
                    backgroundColor: '#374151', 
                    color: 'white',
                    border: '2px solid #4b5563',
                    fontFamily: 'monospace'
                  }}
                >
                  📊 MY DASHBOARD
                </a>
              )}
              <a 
                href="/deposit"
                className="px-6 py-3 rounded font-bold transition-all hover:brightness-110"
                style={{ 
                  backgroundColor: '#ca8a04', 
                  color: 'black',
                  fontFamily: 'monospace'
                }}
              >
                💰 ADD COINS
              </a>
            </div>

            {/* Social Buttons */}
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://discord.com/invite/UnDRjTc9jP"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded font-bold transition-all flex items-center gap-2 hover:brightness-110"
                style={{ backgroundColor: '#5865F2', color: 'white', fontFamily: 'monospace' }}
              >
                <span>💬</span> Join Discord
              </a>
              <a 
                href="https://www.youtube.com/@ItxMuneebYT"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded font-bold transition-all flex items-center gap-2 hover:brightness-110"
                style={{ backgroundColor: '#FF0000', color: 'white', fontFamily: 'monospace' }}
              >
                <span>▶️</span> Subscribe
              </a>
            </div>
          </div>
        </div>

        {/* Plugins Grid */}
        {plugins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plugins.map((plugin: Plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                isPurchased={purchasedPluginIds.includes(plugin.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-text-secondary">No plugins available yet.</p>
            {isAdmin && (
              <p className="text-text-secondary mt-4">
                Go to the <a href="/admin/plugins" className="text-accent-primary hover:underline">admin panel</a> to add plugins.
              </p>
            )}
          </div>
        )}
      </main>
      </div>
    </>
  )
}
