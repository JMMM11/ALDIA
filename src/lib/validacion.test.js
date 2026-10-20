// Ejecutar con: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarReporte } from './validacion.js';

const valido = { sector: 'villa-del-campo', tipo: 'crecida', descripcion: 'El río está subiendo detrás del puente.' };

test('acepta un reporte válido', () => {
  assert.deepEqual(validarReporte(valido), {});
});

test('rechaza sector y tipo fuera del catálogo', () => {
  const e = validarReporte({ ...valido, sector: 'otro', tipo: "x'; drop table reportes;--" });
  assert.ok(e.sector);
  assert.ok(e.tipo);
});

test('exige entre 10 y 280 caracteres', () => {
  assert.ok(validarReporte({ ...valido, descripcion: '   corto   ' }).descripcion);
  assert.ok(validarReporte({ ...valido, descripcion: 'a'.repeat(281) }).descripcion);
  assert.deepEqual(validarReporte({ ...valido, descripcion: 'a'.repeat(280) }), {});
});

test('detecta teléfonos panameños', () => {
  for (const tel of ['6123-4567', '61234567', '+507 6123 4567', '254-1234']) {
    assert.ok(validarReporte({ ...valido, descripcion: `Llámenme al ${tel} por favor` }).descripcion, tel);
  }
  assert.deepEqual(validarReporte({ ...valido, descripcion: 'Subió como 30 cm desde las 4 de la tarde' }), {});
});
