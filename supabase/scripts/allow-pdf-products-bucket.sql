-- Permite subir PDFs (ficha técnica) al bucket products.
-- Ejecutar en Supabase → SQL Editor si ya creaste el proyecto antes de este cambio.

update storage.buckets
set
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
where id = 'products';
