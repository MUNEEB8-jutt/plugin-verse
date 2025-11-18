import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login to PluginVerse',
  description: 'Login to your PluginVerse account to purchase and download premium Minecraft plugins with coins.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
