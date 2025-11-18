import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pluginverse.vercel.app'
  
  // Get all plugins for dynamic URLs
  const supabase = await createClient()
  const { data: plugins } = await supabase
    .from('plugins')
    .select('id, created_at')
    .order('created_at', { ascending: false })

  const pluginUrls = (plugins || []).map((plugin) => ({
    url: `${baseUrl}/plugin/${plugin.id}`,
    lastModified: new Date(plugin.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...pluginUrls,
  ]
}
