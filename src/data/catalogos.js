// Catálogos compartidos por la interfaz y la validación.
// Los mismos ids están en las restricciones CHECK de supabase/migrations.

export const SECTORES = [
  { id: 'villa-del-campo', nombre: 'Villa del Campo' },
  { id: 'valle-dorado', nombre: 'Valle Dorado' },
  { id: 'nicolas-solano', nombre: 'Nicolás Solano' },
  { id: 'martin-sanchez', nombre: 'Martín Sánchez' },
];

export const TIPOS = [
  {
    id: 'crecida',
    nombre: 'Crecida de río',
    corto: 'Crecida',
    ayuda: 'El Caimito o el Martín Sánchez están subiendo.',
  },
  {
    id: 'corte-agua',
    nombre: 'Corte de agua',
    corto: 'Agua',
    ayuda: 'No hay servicio o la presión está muy baja.',
  },
  {
    id: 'via-cerrada',
    nombre: 'Vía cerrada',
    corto: 'Vía',
    ayuda: 'Calle inundada, árbol caído o paso bloqueado.',
  },
  {
    id: 'traslado',
    nombre: 'Traslado',
    corto: 'Traslado',
    ayuda: 'Necesitas llegar al Hospital Nicolás A. Solano.',
    // Las solicitudes de traslado no se publican: solo las ve un moderador.
    privado: true,
  },
];

export const LIMITE_DESCRIPCION = { min: 10, max: 280 };

const porId = (lista) => Object.fromEntries(lista.map((x) => [x.id, x]));
const SECTOR = porId(SECTORES);
const TIPO = porId(TIPOS);

export const nombreSector = (id) => SECTOR[id]?.nombre ?? id;
export const tipoPorId = (id) => TIPO[id];
