const url = import.meta.env.VITE_SUPABASE_URL;
const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Sin claves, el sitio corre en modo demostración.
export const configurado = Boolean(url && clave);

// Solo la clave publicable vive en el navegador; la seguridad la imponen las
// políticas RLS. El cliente se descarga aparte para no frenar la primera carga.
let cliente;
export function obtenerCliente() {
  cliente ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, clave));
  return cliente;
}
