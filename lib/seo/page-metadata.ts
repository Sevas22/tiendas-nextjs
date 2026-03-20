import type { Metadata } from "next"
import { siteUrl } from "./site-metadata"

/** Textos SEO por ruta (es-VE). Ajusta aquí títulos y descripciones sin tocar cada página. */
export const pageSeo = {
  products: {
    title: "Al por mayor",
    description:
      "Catálogo al por mayor con fichas técnicas. Productos alimenticios y más para importadores y distribuidores.",
  },
  store: {
    title: "Tienda",
    description:
      "Tienda venextrading: productos listos para pedido. Explora categorías y solicita cotización (RFQ).",
  },
  request: {
    title: "RFQ — Solicitud de cotización",
    description:
      "Envía tu RFQ: producto, cantidad y datos de contacto. Nuestro equipo te responde a la brevedad.",
  },
  registro: {
    title: "Registro de vendedores",
    description:
      "Crea tu cuenta como proveedor en venextrading y publica tu catálogo y productos de tienda.",
  },
  admin: {
    title: "Acceso proveedores",
    description: "Inicio de sesión para proveedores y administración de catálogo en venextrading.",
  },
  ruedasDeNegocios: {
    title: "Ruedas de negocios",
    description:
      "Encuentros B2B venextrading: conectamos compradores y vendedores en EE. UU., Medio Oriente y China.",
  },
} as const

const canonicalPath: Record<keyof typeof pageSeo, string> = {
  products: "/products",
  store: "/store",
  request: "/request",
  registro: "/registro",
  admin: "/admin",
  ruedasDeNegocios: "/ruedas-de-negocios",
}

export function buildPageMetadata(key: keyof typeof pageSeo): Metadata {
  const { title, description } = pageSeo[key]
  const path = canonicalPath[key]
  const pageUrl = new URL(path, siteUrl).toString()
  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${title} | venextrading`,
      description,
      url: pageUrl,
    },
    twitter: {
      title: `${title} | venextrading`,
      description,
    },
  }
}
