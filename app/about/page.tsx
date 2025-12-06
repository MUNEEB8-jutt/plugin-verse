import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { AboutPageContent } from '@/components/AboutPageContent'

export const metadata = {
  title: "About Us - PluginVerse",
  description: "Meet the team behind PluginVerse - MuneebYT and HoneyBoy, passionate Minecraft developers creating premium plugins and mods.",
}

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.user_metadata?.role === 'admin'

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} isAdmin={isAdmin} />
      <AboutPageContent />
    </div>
  )
}
