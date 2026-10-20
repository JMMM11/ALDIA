import { SECTORES, TIPOS, LIMITE_DESCRIPCION } from '../data/catalogos.js';

// Teléfonos de Panamá: 7 dígitos (fijo) u 8 (celular), con o sin guion y +507.
const PATRON_TELEFONO = /(\+?507[\s-]?)?\b\d{3,4}[\s-]?\d{4}\b/;

// Validación del lado del cliente para dar mensajes claros. La base de datos
// repite estas reglas con restricciones CHECK, que son las que valen.
export function validarReporte({ sector, tipo, descripcion }) {
  const errores = {};
  if (!SECTORES.some((s) => s.id === sector)) errores.sector = 'Elige tu sector.';
  if (!TIPOS.some((t) => t.id === tipo)) errores.tipo = 'Elige qué está pasando.';

  const texto = (descripcion ?? '').trim();
  if (texto.length < LIMITE_DESCRIPCION.min) {
    errores.descripcion = `Cuenta un poco más: mínimo ${LIMITE_DESCRIPCION.min} caracteres.`;
  } else if (texto.length > LIMITE_DESCRIPCION.max) {
    errores.descripcion = `Máximo ${LIMITE_DESCRIPCION.max} caracteres.`;
  } else if (PATRON_TELEFONO.test(texto)) {
    errores.descripcion = 'Quita el número de teléfono. Un moderador te conecta sin publicarlo.';
  }
  return errores;
}
