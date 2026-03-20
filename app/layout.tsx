import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { GoogleTagManager } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/next"
import { GtmNoScript } from "@/components/analytics/gtm-noscript"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { defaultMetadata, gtmId, siteUrl } from "@/lib/seo/site-metadata"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Favicon / Apple touch: `app/icon.png` y `app/apple-icon.png` (logo venextrading)
export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  themeColor: "#00247D",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "venextrading",
  alternateName: "venex trading",
  description: "Marketplace venezolano. Conectamos vendedores y compradores con productos de calidad.",
  url: siteUrl,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-VE">
      <body className="font-sans antialiased">
        {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
        <GtmNoScript gtmId={gtmId} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
