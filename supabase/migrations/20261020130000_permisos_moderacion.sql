-- Supabase concede EXECUTE a anon por defecto en las funciones nuevas.
-- Un visitante sin sesión no tiene por qué poder llamar a las funciones de
-- moderador (igual fallarían por dentro): se le quita el permiso.
revoke execute on function
  public.validar_reporte(uuid), public.marcar_oficial(uuid, text, text),
  public.cerrar_reporte(uuid), public.responder_traslado(uuid, text)
  from anon;
