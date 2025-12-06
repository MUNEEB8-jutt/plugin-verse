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
    default: "PluginVerse - Minecraft Plugins & Mods Marketplace Pakistan | Premium Plugin Store",
    template: "%s | PluginVerse"
  },
  description: "Pakistan's #1 marketplace for Minecraft plugins and mods. Discover, purchase and download premium Minecraft plugins with coins. Browse free and paid plugins for your Minecraft server.",
  keywords: [
    "PluginVerse Pakistan",
    "Minecraft plugins Pakistan",
    "Minecraft mods Pakistan",
    "plugin marketplace Pakistan",
    "Minecraft server plugins PK",
    "premium plugins Pakistan",
    "free plugins Pakistan",
    "plugin store Pakistan",
    "buy Minecraft plugins Pakistan",
    "download Minecraft mods Pakistan",
    "Pakistan Minecraft community",
    "Minecraft server Pakistan",
    "plugin shop Pakistan",
    "Minecraft marketplace Pakistan"
  ],
  authors: [{ name: "PluginVerse Pakistan", url: "https://pluginverse.vercel.app" }],
  creator: "PluginVerse Pakistan",
  publisher: "PluginVerse Pakistan",
  applicationName: "PluginVerse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    alternateLocale: ["ur_PK"],
    url: "https://pluginverse.vercel.app",
    title: "PluginVerse Pakistan - Minecraft Plugins & Mods Marketplace",
    description: "🎮 Pakistan's #1 marketplace for Minecraft plugins and mods. 💎 Premium & Free plugins. 💰 Coin-based system. 🇵🇰 Made for Pakistani Minecraft community.",
    siteName: "PluginVerse Pakistan",
    images: [
      {
        url: "https://pluginverse.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "PluginVerse Pakistan - Minecraft Plugin & Mod Marketplace",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PluginVerse Pakistan - Minecraft Plugins & Mods Marketplace",
    description: "🎮 Pakistan's #1 marketplace for Minecraft plugins and mods. 💎 Premium & Free plugins. 💰 Coin-based system.",
    images: ["https://pluginverse.vercel.app/logo.png"],
    creator: "@ItxMuneebYT",
    site: "@PluginVersePK",
  },
  other: {
    "geo.region": "PK",
    "geo.placename": "Pakistan",
    "geo.position": "30.3753;69.3451",
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const videoUrl = `${supabaseUrl}/storage/v1/object/public/background/video.mp4`;

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
              "name": "PluginVerse Pakistan",
              "alternateName": "PluginVerse",
              "url": "https://pluginverse.vercel.app",
              "logo": "https://pluginverse.vercel.app/logo.png",
              "description": "Pakistan's #1 marketplace for Minecraft plugins and mods",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PK"
              },
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
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10 opacity-20"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="fixed inset-0 bg-slate-900/60 -z-10" />

        {children}
      </body>
    </html>
  );
}
