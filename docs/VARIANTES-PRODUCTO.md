# Variantes de producto (modelo Shopify)

## Resumen

- **Producto padre** (`products`): nombre, descripción, SEO, specs JSON, imagen principal.
- **Variantes** (`product_variants`): unidad vendible con precio, stock, SKU, imagen, color.
- **Opciones** (`product_option_groups` + `product_option_values`): ej. Sabor → Chocolate, Vainilla.
- **`option_signature`**: clave única por combinación (ej. `sabor:chocolate`).

## Migración

Ejecuta en Supabase → SQL Editor:

`supabase/migrations/20250523100000_product_variants.sql`

## Admin

1. Crear/editar producto.
2. Activa **Este producto tiene variantes**.
3. Define nombre de opción (Sabor, Talla, etc.).
4. Añade filas con nombre, color, precio, stock, SKU, imagen.
5. Guarda.

## Tienda

- Selector visual (swatches) en `/store/[id]`.
- **Carrito** usa siempre `variantId` (localStorage `venextrading_cart`).
- Productos sin variantes usan `product.id` como `variantId`.

## Pedidos (futuro)

`order_items.variant_id` → referencia a `product_variants.id`.
