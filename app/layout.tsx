import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { CustomCursor } from "@/components/CustomCursor";
import { ClickSoundProvider } from "@/components/ClickSoundProvider";

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
  description: "Download completely FREE Minecraft plugins & mods. Best marketplace for Spigot, Bukkit, Paper plugins. Server essentials, minigames, economy, protection plugins. 100% Free downloads!",
  keywords: [
    // Main keywords
    "Minecraft plugins",
    "Minecraft mods",
    "free Minecraft plugins",
    "download Minecraft plugins free",
    "Minecraft plugin marketplace",
    
    // Create plugin keywords
    "create free Minecraft plugin",
    "create your own Minecraft plugin",
    "how to create Minecraft plugin",
    "make your own plugin",
    "custom Minecraft plugin",
    "get custom plugin made",
    "request Minecraft plugin",
    "plugin development",
    "free plugin creation",
    
    // Server types
    "Spigot plugins",
    "Bukkit plugins", 
    "Paper plugins",
    "Minecraft server plugins",
    "server plugins free",
    
    // Plugin types
    "economy plugins",
    "protection plugins",
    "minigame plugins",
    "PvP plugins",
    "survival plugins",
    "anti cheat plugin",
    "permissions plugin",
    "shop plugin",
    "essentials plugin",
    
    // Popular plugins
    "WorldEdit plugin",
    "EssentialsX",
    "Vault plugin",
    "LuckPerms",
    
    // Search terms
    "best Minecraft plugins 2024",
    "best Minecraft plugins 2025",
    "top Minecraft plugins",
    "Minecraft plugin download",
    "free plugin download",
    "Minecraft server mods",
    "download Minecraft mods free",
    
    // Pakistan specific
    "Minecraft plugins Pakistan",
    "Pakistani Minecraft server",
    "free plugins Pakistan",
    
    // Long tail keywords
    "how to get free Minecraft plugins",
    "where to download Minecraft plugins",
    "best free Minecraft server plugins",
    "Minecraft plugin store free",
    "custom plugin request free",
    "Minecraft plugin maker",
    "plugin for Minecraft server",
    "free server plugins download"
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
    description: "🎮 Best marketplace for Minecraft plugins and mods. ✨ Completely FREE downloads! Spigot, Bukkit, Paper plugins for your server.",
    siteName: "PluginVerse",
    images: [
      {
        url: "https://pluginverse.vercel.app/logo.png",
        width: 500,
        height: 500,
        alt: "PluginVerse - Minecraft Plugin Marketplace",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PluginVerse - Minecraft Plugins & Mods Marketplace",
    description: "🎮 Best marketplace for Minecraft plugins and mods. ✨ Completely FREE downloads for your server!",
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
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#10b981" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "PluginVerse",
              "alternateName": ["PluginVerse Pakistan", "Minecraft Plugin Store"],
              "url": "https://pluginverse.vercel.app",
              "description": "Pakistan's #1 marketplace for Minecraft plugins and mods. Download completely FREE Spigot, Bukkit, Paper plugins. Server essentials, minigames, economy, protection plugins. Get your own custom plugin made!",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://pluginverse.vercel.app/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PluginVerse",
              "url": "https://pluginverse.vercel.app",
              "logo": "https://pluginverse.vercel.app/logo.png",
              "description": "Completely FREE Minecraft plugins and mods marketplace in Pakistan",
              "foundingDate": "2024",
              "sameAs": [
                "https://discord.com/invite/UnDRjTc9jP",
                "https://www.youtube.com/@ItxMuneebYT"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "url": "https://discord.com/invite/UnDRjTc9jP"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              "name": "Main Navigation",
              "hasPart": [
                {
                  "@type": "WebPage",
                  "name": "Browse Plugins",
                  "description": "Explore all completely FREE Minecraft plugins",
                  "url": "https://pluginverse.vercel.app/"
                },
                {
                  "@type": "WebPage",
                  "name": "Login",
                  "description": "Sign in to your PluginVerse account",
                  "url": "https://pluginverse.vercel.app/login"
                },
                {
                  "@type": "WebPage",
                  "name": "Sign Up",
                  "description": "Create a new PluginVerse account for free",
                  "url": "https://pluginverse.vercel.app/signup"
                },
                {
                  "@type": "WebPage",
                  "name": "Make Your Own Plugin",
                  "description": "Get your own custom Minecraft plugin made for free",
                  "url": "https://pluginverse.vercel.app/request"
                },
                {
                  "@type": "WebPage",
                  "name": "My Account",
                  "description": "Manage your PluginVerse account and downloads",
                  "url": "https://pluginverse.vercel.app/account"
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans`}
        style={{ position: 'relative', minHeight: '100vh' }}
      >
        {/* Dark background base */}
        <div className="fixed inset-0 -z-20 bg-[#030712]" />

        {/* Subtle gradient overlay */}
        <div
          className="fixed inset-0 -z-10 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at top, #1e3a5f 0%, transparent 50%), radial-gradient(ellipse at bottom right, #1a2e35 0%, transparent 50%)',
          }}
        />

        {/* Very subtle noise texture */}
        <div
          className="fixed inset-0 -z-10 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <ToastProvider>
          <ClickSoundProvider>
            <CustomCursor />
            {children}
          </ClickSoundProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
