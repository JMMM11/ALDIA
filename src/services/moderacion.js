import { obtenerCliente } from '../lib/supabase.js';

// Acciones de moderador. Cada función de la base de datos vuelve a comprobar
// que quien llama es moderador del sector; esta capa solo las invoca.

export async function iniciarSesion(correo, clave) {
  const supabase = await obtenerCliente();
  const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave });
  if (error) throw error;
}

export async function cerrarSesion() {
  const supabase = await obtenerCliente();
  await supabase.auth.signOut();
}

// Devuelve el registro de moderador del usuario actual, o null.
export async function moderadorActual() {
  const supabase = await obtenerCliente();
  const { data } = await supabase.auth.getSession();
  const usuario = data.session?.user;
  if (!usuario || usuario.is_anonymous) return null;
  const { data: fila, error } = await supabase.from('moderadores').select('sector').maybeSingle();
  if (error) throw error;
  return fila ? { correo: usuario.email, sector: fila.sector } : null;
}

async function rpc(nombre, args) {
  const supabase = await obtenerCliente();
  const { error } = await supabase.rpc(nombre, args);
  if (error) throw error;
}

export const validar = (id) => rpc('validar_reporte', { p_id: id });
export const marcarOficial = (id, fuente, url) => rpc('marcar_oficial', { p_id: id, p_fuente: fuente, p_url: url });
export const cerrar = (id) => rpc('cerrar_reporte', { p_id: id });
export const responderTraslado = (id, nota) => rpc('responder_traslado', { p_id: id, p_nota: nota });
