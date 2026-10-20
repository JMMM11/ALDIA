-- ALDÍA: privilegios mínimos, políticas RLS, funciones de moderador y tiempo real.

-- RLS en todas las tablas --------------------------------------------------------

alter table public.reportes enable row level security;
alter table public.confirmaciones enable row level security;
alter table public.moderadores enable row level security;

-- Privilegios mínimos: se quita todo y se concede solo lo necesario.
revoke all on public.reportes, public.confirmaciones, public.moderadores, public.alertas
  from public, anon, authenticated;

-- Se puede leer todo excepto quién reportó y quién moderó.
grant select (
  id, sector, tipo, descripcion, creado_en, n_confirma, n_falso, n_confirma_30,
  ultima_confirmacion, validado_en, oficial_fuente, oficial_url, oficial_en,
  cerrado_en, nota_moderador
) on public.reportes to anon, authenticated;

-- Al crear un reporte el cliente solo decide estos tres campos.
grant insert (sector, tipo, descripcion) on public.reportes to authenticated;

grant select (id, reporte_id, voto, creado_en) on public.confirmaciones to authenticated;
grant insert (reporte_id, voto) on public.confirmaciones to authenticated;

grant select on public.alertas to anon, authenticated;
grant select on public.moderadores to authenticated;

-- reportes: los traslados solo los ven quien los pidió y los moderadores.
create policy "Leer reportes públicos, propios o del sector que modero"
  on public.reportes for select
  to anon, authenticated
  using (
    tipo <> 'traslado'
    or user_id = (select auth.uid())
    or public.es_moderador(sector)
  );

create policy "Vecinos con sesión crean sus reportes"
  on public.reportes for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Sin políticas de update ni delete: nadie modifica ni borra reportes desde el
-- cliente. Los moderadores usan las funciones de abajo.

-- confirmaciones: cada quien ve solo sus votos; nadie ve quién votó qué.
create policy "Cada vecino ve sus propios votos"
  on public.confirmaciones for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Vecinos con sesión votan"
  on public.confirmaciones for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- moderadores: solo se ve el propio registro. Altas y bajas, desde el panel.
create policy "Moderador ve su propio registro"
  on public.moderadores for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Funciones de moderador -------------------------------------------------------

create function public.validar_reporte(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sector text;
begin
  select sector into v_sector from public.reportes where id = p_id and tipo <> 'traslado';
  if not found then
    raise exception 'reporte_inexistente' using errcode = 'P0002';
  end if;
  if not public.es_moderador(v_sector) then
    raise exception 'solo_moderadores' using errcode = '42501';
  end if;
  update public.reportes set validado_por = auth.uid(), validado_en = now() where id = p_id;
end;
$$;

create function public.marcar_oficial(p_id uuid, p_fuente text, p_url text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sector text;
begin
  select sector into v_sector from public.reportes where id = p_id and tipo <> 'traslado';
  if not found then
    raise exception 'reporte_inexistente' using errcode = 'P0002';
  end if;
  if not public.es_moderador(v_sector) then
    raise exception 'solo_moderadores' using errcode = '42501';
  end if;
  -- Las restricciones CHECK de la tabla validan la fuente y que el enlace sea https.
  update public.reportes
  set oficial_fuente = p_fuente, oficial_url = btrim(p_url), oficial_por = auth.uid(), oficial_en = now()
  where id = p_id;
end;
$$;

create function public.cerrar_reporte(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sector text;
begin
  select sector into v_sector from public.reportes where id = p_id;
  if not found then
    raise exception 'reporte_inexistente' using errcode = 'P0002';
  end if;
  if not public.es_moderador(v_sector) then
    raise exception 'solo_moderadores' using errcode = '42501';
  end if;
  update public.reportes set cerrado_en = now() where id = p_id;
end;
$$;

create function public.responder_traslado(p_id uuid, p_nota text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sector text;
begin
  select sector into v_sector from public.reportes where id = p_id and tipo = 'traslado';
  if not found then
    raise exception 'reporte_inexistente' using errcode = 'P0002';
  end if;
  if not public.es_moderador(v_sector) then
    raise exception 'solo_moderadores' using errcode = '42501';
  end if;
  if p_nota ~ '\m\d{3,4}[ -]?\d{4}\M' then
    raise exception 'sin_telefonos' using errcode = '23514';
  end if;
  update public.reportes set nota_moderador = btrim(p_nota) where id = p_id;
end;
$$;

-- Cifras públicas del inicio. Usa la misma vista del semáforo.
create function public.estadisticas()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'alertas_confirmadas',
    (select count(*) from public.alertas a where a.nivel >= 3 and a.tipo <> 'traslado'),
    'vecinos',
    (select count(*) from (
      select user_id from public.reportes
      union
      select user_id from public.confirmaciones
    ) personas)
  );
$$;

-- Permisos de ejecución --------------------------------------------------------

revoke execute on function
  public.antes_de_reportar(), public.antes_de_votar(), public.despues_de_votar()
  from public, anon, authenticated;

revoke execute on function
  public.es_anonimo(), public.es_moderador(text), public.reporte_es_mio(uuid),
  public.validar_reporte(uuid), public.marcar_oficial(uuid, text, text),
  public.cerrar_reporte(uuid), public.responder_traslado(uuid, text), public.estadisticas()
  from public;

-- Usadas por las políticas y la vista, deben poder ejecutarse.
grant execute on function public.es_anonimo(), public.es_moderador(text), public.reporte_es_mio(uuid)
  to anon, authenticated;
grant execute on function public.estadisticas() to anon, authenticated;
-- Cada función revisa por dentro que quien llama sea moderador.
grant execute on function
  public.validar_reporte(uuid), public.marcar_oficial(uuid, text, text),
  public.cerrar_reporte(uuid), public.responder_traslado(uuid, text)
  to authenticated;

-- Tiempo real ------------------------------------------------------------------
-- No se publica la tabla reportes en Realtime: el evento llevaría la fila
-- completa (incluido user_id). Se publica solo una marca de tiempo que avisa
-- "algo cambió", y cada cliente vuelve a leer la vista con sus permisos.

create table public.version_alertas (
  id smallint primary key default 1 check (id = 1),
  cambiado_en timestamptz not null default now()
);
insert into public.version_alertas default values;

alter table public.version_alertas enable row level security;
revoke all on public.version_alertas from public, anon, authenticated;
grant select on public.version_alertas to anon, authenticated;
create policy "Cualquiera ve la marca de cambio"
  on public.version_alertas for select
  to anon, authenticated
  using (true);

create function public.marcar_cambio()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.version_alertas set cambiado_en = now() where id = 1;
  return null;
end;
$$;

revoke execute on function public.marcar_cambio() from public, anon, authenticated;

create trigger reportes_marcar_cambio
  after insert or update or delete on public.reportes
  for each statement execute function public.marcar_cambio();

alter publication supabase_realtime add table public.version_alertas;
