-- Crear tabla de activos del portafolio
create table public.portfolio_assets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    symbol text not null,
    asset_name text not null,
    asset_type text not null check (asset_type in ('CEDEAR', 'STOCK', 'ETF', 'BOND')),
    quantity numeric not null check (quantity > 0),
    purchase_price numeric not null check (purchase_price >= 0),
    current_price numeric not null check (current_price >= 0),
    created_at timestamp with time zone default now()
);

-- Habilitar la Seguridad a Nivel de Filas (Row Level Security - RLS)
alter table public.portfolio_assets enable row level security;

-- Crear políticas para que cada usuario interactúe solo con sus propios datos

-- 1. Política para SELECCIONAR (Leer)
create policy "Usuarios solo pueden ver sus propios activos"
on public.portfolio_assets for select
using ( auth.uid() = user_id );

-- 2. Política para INSERTAR (Crear)
create policy "Usuarios solo pueden insertar activos a su nombre"
on public.portfolio_assets for insert
with check ( auth.uid() = user_id );

-- 3. Política para ACTUALIZAR
create policy "Usuarios solo pueden actualizar sus propios activos"
on public.portfolio_assets for update
using ( auth.uid() = user_id )
with check ( auth.uid() = user_id );

-- 4. Política para ELIMINAR
create policy "Usuarios solo pueden eliminar sus propios activos"
on public.portfolio_assets for delete
using ( auth.uid() = user_id );
