import { obtenerCliente } from '../lib/supabase.js';

// Toda la comunicación con Supabase pasa por aquí. El nivel del semáforo llega
// calculado desde la vista public.alertas; el navegador nunca lo decide.

const aAlerta = (f) => ({
  id: f.id,
  sector: f.sector,
  tipo: f.tipo,
  descripcion: f.descripcion,
  nivel: f.nivel,
  confirmaciones: f.confirmaciones,
  falsos: f.falsos,
  creadoEn: f.creado_en,
  validada: f.validada,
  fuente: f.oficial_fuente ? { nombre: f.oficial_fuente, url: f.oficial_url } : null,
  esMio: f.es_mio,
  nota: f.nota_moderador,
  ejemplo: false,
});

// Mensajes para los errores que lanza la base de datos (ver supabase/migrations).
// Primero los específicos, luego los códigos genéricos.
const MENSAJES = {
  voto_propio: 'Es tu reporte: no puedes confirmarlo tú. Espera a otros vecinos.',
  alerta_archivada: 'Esta alerta ya se archivó: pasaron 2 horas sin confirmaciones.',
  limite_reportes: 'Llegaste al límite de 5 reportes por hora. Intenta más tarde.',
  descripcion_sin_telefono: 'Quita el número de teléfono. Un moderador te conecta sin publicarlo.',
  solo_moderadores: 'Solo un moderador del sector puede hacer eso.',
  anonymous_provider_disabled: 'La participación anónima aún no está activada en la base de datos.',
  '23505': 'Ya votaste este reporte.',
  '23514': 'Revisa los datos: alguno no cumple las reglas.',
  '42501': 'No tienes permiso para esa acción.',
};

export function mensajeError(error) {
  if (!error) return null;
  const clave = Object.keys(MENSAJES).find((k) => error.message?.includes(k) || error.code === k);
  return clave ? MENSAJES[clave] : 'No se pudo completar. Revisa tu conexión e intenta de nuevo.';
}

export async function asegurarSesion() {
  const supabase = await obtenerCliente();
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const { data: nueva, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return nueva.session;
}

export async function listarAlertas() {
  const supabase = await obtenerCliente();
  const { data, error } = await supabase
    .from('alertas')
    .select('*')
    .eq('archivada', false)
    .order('creado_en', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data.map(aAlerta);
}

export async function listarMisVotos() {
  const supabase = await obtenerCliente();
  const { data, error } = await supabase.from('confirmaciones').select('reporte_id, voto');
  if (error) throw error;
  return Object.fromEntries(data.map((v) => [v.reporte_id, v.voto]));
}

export async function votar(reporteId, voto) {
  const supabase = await obtenerCliente();
  const { error } = await supabase.from('confirmaciones').insert({ reporte_id: reporteId, voto });
  if (error) throw error;
}

export async function crearReporte({ sector, tipo, descripcion }) {
  const supabase = await obtenerCliente();
  const { error } = await supabase.from('reportes').insert({ sector, tipo, descripcion: descripcion.trim() });
  if (error) throw error;
}

export async function obtenerEstadisticas() {
  const supabase = await obtenerCliente();
  const { data, error } = await supabase.rpc('estadisticas');
  if (error) throw error;
  return { alertasConfirmadas: data.alertas_confirmadas, vecinos: data.vecinos };
}

// La tabla reportes no se publica en Realtime (el evento llevaría la fila
// completa). La base de datos solo avisa "algo cambió" en version_alertas y aquí
// se vuelve a leer la vista con los permisos de cada quien.
// Devuelve una función para cancelar la suscripción.
export function suscribirCambios(alCambiar) {
  let canal;
  let cancelado = false;
  obtenerCliente().then((supabase) => {
    if (cancelado) return;
    canal = supabase
      .channel('alertas-en-vivo')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'version_alertas' }, alCambiar)
      .subscribe();
  });
  return () => {
    cancelado = true;
    if (canal) obtenerCliente().then((supabase) => supabase.removeChannel(canal));
  };
}
