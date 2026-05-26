import { z } from "zod"

const urlOptional = z
  .string()
  .url("URL inválida")
  .optional()
  .or(z.literal(""))

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Nombre de tienda requerido").max(120),
  logoUrl: urlOptional,
  faviconUrl: urlOptional,
  bannerUrls: z.array(z.string().url()).default([]),
  contactEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  contactPhone: z.string().max(30).optional(),
  address: z.string().max(500).optional(),
  socialInstagram: z.string().max(200).optional(),
  socialFacebook: z.string().max(200).optional(),
  socialLinkedin: z.string().max(200).optional(),
  socialWhatsapp: z.string().max(200).optional(),
  paymentMethods: z.array(z.string().min(1)).default([]),
  shippingMethods: z.array(z.string().min(1)).default([]),
})

export type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>

export const adminLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})
