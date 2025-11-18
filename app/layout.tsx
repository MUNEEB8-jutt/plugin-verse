import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pluginverse.vercel.app'),
  title: {
    default: "PluginVerse - Premium Minecraft Plugin Marketplace",
    template: "%s | PluginVerse"
  },
  description: "Discover, purchase and download premium Minecraft plugins with coins. Free and paid plugins marketplace for server owners and developers.",
  keywords: [
    "PluginVerse",
    "Minecraft plugins",
    "plugin marketplace",
    "Minecraft server plugins",
    "premium plugins",
    "free plugins",
    "plugin store",
    "coins system",
    "server plugins",
    "Minecraft marketplace",
    "download plugins",
    "buy plugins"
  ],
  authors: [{ name: "MuneebYT" }],
  creator: "MuneebYT",
  publisher: "MuneebYT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pluginverse.vercel.app",
    title: "PluginVerse - Premium Minecraft Plugin Marketplace",
    description: "Discover, purchase and download premium Minecraft plugins with coins. Free and paid plugins marketplace for server owners.",
    siteName: "PluginVerse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PluginVerse - Minecraft Plugin Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PluginVerse - Premium Minecraft Plugin Marketplace",
    description: "Discover, purchase and download premium Minecraft plugins with coins. Free and paid plugins marketplace.",
    images: ["/og-image.png"],
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const videoUrl = `${supabaseUrl}/storage/v1/object/public/background/video.mp4`;

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="ZNW4Kq5aHaE1VIMnIktb42XCMfHZlbv21nrfpNJH1Uo" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ position: 'relative', minHeight: '100vh' }}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            opacity: 0.3
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/* Dark overlay for better readability */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: -1
          }}
        />

        {children}
      </body>
    </html>
  );
}
