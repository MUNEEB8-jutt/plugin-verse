import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up for PluginVerse',
  description: 'Create your PluginVerse account to start purchasing and downloading premium Minecraft plugins with coins system.',
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
