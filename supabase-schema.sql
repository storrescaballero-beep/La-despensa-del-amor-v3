-- =============================================
-- LA DESPENSA DEL AMOR — Supabase SQL Schema
-- Ejecuta esto en Supabase > SQL Editor
-- =============================================

-- Tabla de items de la lista
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'otros',
  quantity integer not null default 1,
  done boolean not null default false,
  added_by text not null default 'yo',
  created_at timestamptz default now()
);

-- Tabla del menú semanal
create table if not exists menus (
  id uuid primary key default gen_random_uuid(),
  week_data jsonb not null,
  created_at timestamptz default now()
);

-- Habilitar Realtime para la tabla items
alter publication supabase_realtime add table items;

-- Política: acceso público (sin auth — app para dos personas de confianza)
alter table items enable row level security;
alter table menus enable row level security;

create policy "allow all" on items for all using (true) with check (true);
create policy "allow all" on menus for all using (true) with check (true);
