-- ALDÍA: tablas, semáforo calculado en la base de datos y políticas RLS.
--
-- Principios:
--  * El navegador solo tiene la clave publicable. Toda regla vive aquí.
--  * Cada vecino entra con Supabase Anonymous Sign-ins: tiene un user_id sin
--    crear cuenta, y la base de datos usa ese id para "una persona, un voto".
--  * El nivel del semáforo se calcula en la vista public.alertas. Los clientes
--    no pueden escribir contadores, niveles ni campos de moderación.

-- Catálogos (deben coincidir con src/data/catalogos.js) ----------------------

create domain public.sector_aldia as text
  check (value in ('villa-del-campo', 'valle-dorado', 'nicolas-solano', 'martin-sanchez'));

create domain public.tipo_alerta as text
  check (value in ('crecida', 'corte-agua', 'via-cerrada', 'traslado'));

-- Tablas -----------------------------------------------------------------------

-- Moderadores: cuentas con correo y contraseña (nunca anónimas), creadas a mano
-- desde el panel de Supabase. sector null = modera todos los sectores.
create table public.moderadores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  sector public.sector_aldia,
  creado_en timestamptz not null default now()
);

create table public.reportes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  sector public.sector_aldia not null,
  tipo public.tipo_alerta not null,
  descripcion text not null
    constraint descripcion_largo check (char_length(btrim(descripcion)) between 10 and 280)
    -- Sin teléfonos: el moderador conecta a las personas sin publicarlos.
    constraint descripcion_sin_telefono check (descripcion !~ '\m\d{3,4}[ -]?\d{4}\M'),
  creado_en timestamptz not null default now(),

  -- Contadores que mantiene el disparador de confirmaciones.
  n_confirma integer not null default 0,
  n_falso integer not null default 0,
  n_confirma_30 integer not null default 0, -- confirmaciones en los primeros 30 min
  ultima_confirmacion timestamptz,

  -- Acciones de moderador (solo vía funciones validar_reporte / marcar_oficial).
  validado_por uuid references auth.users (id) on delete set null,
  validado_en timestamptz,
  oficial_fuente text check (oficial_fuente in ('SINAPROC', 'IDAAN', 'Municipio')),
  oficial_url text check (oficial_url ~ '^https://\S+$' and char_length(oficial_url) <= 500),
  oficial_por uuid references auth.users (id) on delete set null,
  oficial_en timestamptz,
  cerrado_en timestamptz,
  nota_moderador text check (char_length(nota_moderador) <= 280),

  constraint oficial_completo check (
    (oficial_en is null) = (oficial_fuente is null) and (oficial_fuente is null) = (oficial_url is null)
  )
);

create index reportes_creado_en_idx on public.reportes (creado_en desc);
create index reportes_usuario_idx on public.reportes (user_id, creado_en desc);

create table public.confirmaciones (
  id bigint generated always as identity primary key,
  reporte_id uuid not null references public.reportes (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  voto text not null check (voto in ('confirma', 'falso')),
  creado_en timestamptz not null default now(),
  -- Una persona, un voto por reporte.
  constraint un_voto_por_persona unique (reporte_id, user_id)
);

create index confirmaciones_usuario_idx on public.confirmaciones (user_id);

-- Funciones auxiliares ----------------------------------------------------------

create function public.es_anonimo()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true);
$$;

-- ¿El usuario actual modera este sector? (null = cualquier sector)
create function public.es_moderador(p_sector text default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not public.es_anonimo()
    and exists (
      select 1
      from public.moderadores m
      where m.user_id = (select auth.uid())
        and (p_sector is null or m.sector is null or m.sector = p_sector)
    );
$$;

-- Disparadores -----------------------------------------------------------------

-- Antes de crear un reporte: fija los campos que el cliente no decide y aplica
-- el límite de 5 reportes por hora por persona.
create function public.antes_de_reportar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.user_id := auth.uid();
  if new.user_id is null then
    raise exception 'sesion_requerida' using errcode = '42501';
  end if;

  -- Serializa los reportes de una misma persona para que el límite sea exacto.
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));
  if (
    select count(*) from public.reportes r
    where r.user_id = new.user_id and r.creado_en > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'limite_reportes' using errcode = 'P0001',
      hint = 'Máximo 5 reportes por hora.';
  end if;

  new.descripcion := btrim(new.descripcion);
  new.creado_en := now();
  new.n_confirma := 0;
  new.n_falso := 0;
  new.n_confirma_30 := 0;
  new.ultima_confirmacion := null;
  new.validado_por := null;
  new.validado_en := null;
  new.oficial_fuente := null;
  new.oficial_url := null;
  new.oficial_por := null;
  new.oficial_en := null;
  new.cerrado_en := null;
  new.nota_moderador := null;
  return new;
end;
$$;

create trigger reportes_antes_de_insertar
  before insert on public.reportes
  for each row execute function public.antes_de_reportar();

-- Antes de votar: nadie confirma lo suyo, los traslados no se votan y las
-- alertas archivadas ya no reciben votos.
create function public.antes_de_votar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.reportes;
begin
  new.user_id := auth.uid();
  new.creado_en := now();
  if new.user_id is null then
    raise exception 'sesion_requerida' using errcode = '42501';
  end if;

  select * into r from public.reportes where id = new.reporte_id;
  if not found then
    raise exception 'reporte_inexistente' using errcode = 'P0002';
  end if;
  if r.user_id = new.user_id then
    raise exception 'voto_propio' using errcode = '42501',
      hint = 'Quien reporta no puede confirmar su propio reporte.';
  end if;
  if r.tipo = 'traslado' then
    raise exception 'traslado_no_se_vota' using errcode = '42501';
  end if;
  if r.cerrado_en is not null
    or (r.oficial_en is null and greatest(r.creado_en, r.ultima_confirmacion) < now() - interval '2 hours') then
    raise exception 'alerta_archivada' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger confirmaciones_antes_de_insertar
  before insert on public.confirmaciones
  for each row execute function public.antes_de_votar();

-- Después de votar: actualiza los contadores del reporte.
create function public.despues_de_votar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.reportes r
  set
    n_confirma = r.n_confirma + (new.voto = 'confirma')::int,
    n_falso = r.n_falso + (new.voto = 'falso')::int,
    n_confirma_30 = r.n_confirma_30
      + (new.voto = 'confirma' and new.creado_en <= r.creado_en + interval '30 minutes')::int,
    ultima_confirmacion = case when new.voto = 'confirma' then new.creado_en else r.ultima_confirmacion end
  where r.id = new.reporte_id;
  return null;
end;
$$;

create trigger confirmaciones_despues_de_insertar
  after insert on public.confirmaciones
  for each row execute function public.despues_de_votar();

-- El user_id no se entrega a los clientes; esta función solo dice si el reporte
-- es de quien pregunta (para no dejarle votarlo y mostrarle sus traslados).
create function public.reporte_es_mio(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.reportes r where r.id = p_id and r.user_id = (select auth.uid())
  );
$$;

-- Vista con el semáforo ---------------------------------------------------------
--  4 Oficial: un moderador lo respaldó con la fuente de SINAPROC, IDAAN o Municipio.
--  3 Confirmado: 3+ confirmaciones, o lo validó un moderador.
--  2 En confirmación: 2 confirmaciones (de otras personas) en los primeros 30 min.
--  1 Reportado.
--  Si los votos de falso superan a las confirmaciones, el nivel comunitario baja uno
--  (las decisiones de moderador no bajan por votos).
--  Archivada: cerrada por un moderador, o 2 horas sin confirmaciones (salvo oficial).

create view public.alertas
with (security_invoker = true)
as
select
  r.id,
  r.sector,
  r.tipo,
  r.descripcion,
  r.creado_en,
  r.n_confirma as confirmaciones,
  r.n_falso as falsos,
  r.validado_en is not null as validada,
  r.oficial_fuente,
  r.oficial_url,
  r.nota_moderador,
  public.reporte_es_mio(r.id) as es_mio,
  case
    when r.oficial_en is not null then 4
    when r.validado_en is not null then 3
    else greatest(
      1,
      (case when r.n_confirma >= 3 then 3 when r.n_confirma_30 >= 2 then 2 else 1 end)
        - (r.n_falso > r.n_confirma)::int
    )
  end as nivel,
  (
    r.cerrado_en is not null
    or (r.oficial_en is null and greatest(r.creado_en, r.ultima_confirmacion) < now() - interval '2 hours')
  ) as archivada
from public.reportes r;
