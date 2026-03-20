import type { Metadata } from "next"

/** URL canónica del sitio (SEO, OG, JSON-LD) */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venextrading.com"

/** ID de Google Tag Manager (píxeles, GA4, etc. se configuran dentro del contenedor GTM) */
export const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MTRVTJL7"

export const siteConfig = {
  name: "venextrading",
  locale: "es_VE",
  twitterHandle: undefined as string | undefined,
} as const

/**
 * Metadatos por defecto (título, descripción, Open Graph, Twitter).
 * Las rutas pueden sobreescribir con `export const metadata` en su `layout.tsx` o `page.tsx` (server).
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "venextrading — Mercado Venezolano | Marketplace Venezuela",
    template: "%s | venextrading",
  },
  description:
    "venextrading: marketplace venezolano. Conectamos vendedores y compradores con productos de calidad. Al por mayor, tienda, ruedas de negocios y RFQ.",
  keywords: [
    "venextrading",
    "venex trading",
    "marketplace Venezuela",
    "mercado venezolano",
    "productos Venezuela",
    "al por mayor Venezuela",
    "importación",
    "exportación",
  ],
  authors: [{ name: "venextrading" }],
  creator: "venextrading",
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: "venextrading",
    title: "venextrading — Mercado Venezolano",
    description:
      "Tu marketplace venezolano de confianza. Vendedores, compradores y productos de calidad.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "venextrading — Mercado Venezolano",
    description: "Marketplace venezolano: productos, tienda y solicitudes.",
  },
  robots: {
    index: true,
    follow: true,
  },
}
