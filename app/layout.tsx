import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pluginverse.vercel.app'),
  title: {
    default: "PluginVerse - Best Minecraft Plugins & Mods Marketplace | Free & Premium Plugins",
    template: "%s | PluginVerse"
  },
  description: "Download free and premium Minecraft plugins & mods. Best marketplace for Spigot, Bukkit, Paper plugins. Server essentials, minigames, economy, protection plugins and more.",
  keywords: [
    "Minecraft plugins",
    "Minecraft mods",
    "Spigot plugins",
    "Bukkit plugins",
    "Paper plugins",
    "free Minecraft plugins",
    "premium Minecraft plugins",
    "Minecraft server plugins",
    "plugin marketplace",
    "download Minecraft mods",
    "server plugins",
    "Minecraft essentials",
    "economy plugins",
    "protection plugins",
    "minigame plugins",
    "best Minecraft plugins 2024",
    "Minecraft plugin download",
    "Minecraft server mods",
    "PvP plugins",
    "survival plugins",
    "Minecraft plugin store",
    "buy Minecraft plugins",
    "WorldEdit plugin",
    "EssentialsX",
    "Vault plugin",
    "LuckPerms",
    "Minecraft permissions plugin",
    "anti cheat plugin",
    "Minecraft shop plugin"
  ],
  authors: [{ name: "PluginVerse", url: "https://pluginverse.vercel.app" }],
  creator: "PluginVerse",
  publisher: "PluginVerse",
  applicationName: "PluginVerse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pluginverse.vercel.app",
    title: "PluginVerse - Minecraft Plugins & Mods Marketplace",
    description: "🎮 Best marketplace for Minecraft plugins and mods. 💎 Free & Premium plugins. Download Spigot, Bukkit, Paper plugins for your server.",
    siteName: "PluginVerse",
    images: [
      {
        url: "https://pluginverse.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "PluginVerse - Minecraft Plugin Marketplace",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PluginVerse - Minecraft Plugins & Mods Marketplace",
    description: "🎮 Best marketplace for Minecraft plugins and mods. 💎 Free & Premium plugins for your server.",
    images: ["https://pluginverse.vercel.app/logo.png"],
    creator: "@ItxMuneebYT",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "ZNW4Kq5aHaE1VIMnIktb42XCMfHZlbv21nrfpNJH1Uo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="google-site-verification" content="ZNW4Kq5aHaE1VIMnIktb42XCMfHZlbv21nrfpNJH1Uo" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#10b981" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PluginVerse",
              "url": "https://pluginverse.vercel.app",
              "logo": "https://pluginverse.vercel.app/logo.png",
              "description": "Best marketplace for Minecraft plugins and mods",
              "sameAs": [
                "https://discord.com/invite/UnDRjTc9jP",
                "https://www.youtube.com/@ItxMuneebYT"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans`}
        style={{ position: 'relative', minHeight: '100vh' }}
      >
        {/* Background with gradient and pattern */}
        <div 
          className="fixed inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #0f172a 50%, #134e4a 75%, #0f172a 100%)',
          }}
        />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="fixed inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient orbs for visual interest */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

        {children}
      </body>
    </html>
  );
}
