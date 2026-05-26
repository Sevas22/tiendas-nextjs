-- Ejecutar en SQL Editor después de crear el usuario en Authentication → Users
-- Sustituye el email por el tuyo

update public.profiles
set role = 'admin'
where email = 'admin@tudominio.com';

-- Verificar
select id, email, role, full_name from public.profiles where email = 'admin@tudominio.com';
