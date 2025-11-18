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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const plugin = await getPlugin(id)

  if (!plugin) {
    return {
      title: 'Plugin Not Found',
    }
  }

  return {
    title: `${plugin.title} - ${plugin.price_coins === 0 ? 'Free' : plugin.price_coins + ' Coins'}`,
    description: plugin.description.slice(0, 160),
    openGraph: {
      title: plugin.title,
      description: plugin.description.slice(0, 160),
      images: [plugin.logo_url],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: plugin.title,
      description: plugin.description.slice(0, 160),
      images: [plugin.logo_url],
    },
  }
}

export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const plugin = await getPlugin(id)

  if (!plugin) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.user_metadata?.role === 'admin'
  const isPurchased = user ? await checkPurchase(user.id, id) : false

  // Structured Data for Plugin
  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": plugin.title,
    "description": plugin.description,
    "image": plugin.logo_url,
    "offers": {
      "@type": "Offer",
      "price": plugin.price_coins === 0 ? "0" : plugin.price_coins.toString(),
      "priceCurrency": "COINS",
      "availability": "https://schema.org/InStock",
      "url": `https://pluginverse.vercel.app/plugin/${plugin.id}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
      />
      <div className="min-h-screen">
        <Navbar user={user} isAdmin={isAdmin} />

      <main className="container mx-auto px-4 py-12">
        <Link href="/" className="text-accent-primary hover:underline mb-6 inline-block">
          ← Back to Marketplace
        </Link>

        <div className="glass rounded-lg p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plugin Image */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-bg-secondary">
              <Image
                src={plugin.logo_url}
                alt={plugin.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Plugin Info */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-accent-primary mb-4">
                {plugin.title}
              </h1>

              <div className="mb-6">
                <span className="text-3xl font-bold text-accent-primary">
                  {plugin.price_coins === 0 ? 'FREE' : formatCurrency(plugin.price_coins)}
                </span>
                {plugin.price_coins === 0 && (
                  <span className="ml-3 text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500">
                    Free Plugin
                  </span>
                )}
              </div>

              <div className="mb-6 flex-1">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-text-secondary whitespace-pre-wrap">
                  {plugin.description}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-text-secondary">
                  Added on {formatDate(plugin.created_at)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {user ? (
                  isPurchased ? (
                    <DownloadButton pluginId={plugin.id} pluginTitle={plugin.title} />
                  ) : (
                    <PurchaseButton pluginId={plugin.id} isFree={plugin.price_coins === 0} />
                  )
                ) : (
                  <div className="space-y-2">
                    <p className="text-text-secondary text-center">
                      {plugin.price_coins === 0 
                        ? 'Please login to download this free plugin'
                        : 'Please login to purchase this plugin'}
                    </p>
                    <Link href="/login">
                      <Button className="w-full">Login</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  )
}
