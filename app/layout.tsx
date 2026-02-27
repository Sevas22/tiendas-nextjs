import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venextrading.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "venextrading - Mercado Venezolano | Marketplace Venezuela",
    template: "%s | venextrading",
  },
  description:
    "venextrading - Tu marketplace venezolano de confianza. Conectamos vendedores y compradores con productos de calidad. Productos, tienda y solicitudes en Venezuela.",
  keywords: [
    "venextrading",
    "venex trading",
    "marketplace Venezuela",
    "mercado venezolano",
    "productos Venezuela",
    "tienda Venezuela",
    "comercio Venezuela",
  ],
  authors: [{ name: "venextrading" }],
  creator: "venextrading",
  openGraph: {
    type: "website",
    locale: "es_VE",
    alternateLocale: "en",
    siteName: "venextrading",
    title: "venextrading - Mercado Venezolano",
    description:
      "Tu marketplace venezolano de confianza. Conectamos vendedores y compradores con productos de calidad.",
  },
  twitter: {
    card: "summary_large_image",
    title: "venextrading - Mercado Venezolano",
    description: "Tu marketplace venezolano de confianza.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#00247D",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "venextrading",
  alternateName: "venex trading",
  description: "Marketplace venezolano. Conectamos vendedores y compradores con productos de calidad.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://venextrading.com",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
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
