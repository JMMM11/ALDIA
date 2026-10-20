// Prueba las migraciones de ALDÍA en Postgres real (PGlite) imitando el entorno de
// Supabase: esquema auth, roles anon/authenticated y sus permisos por defecto.
// Ejecutar con: npm run test:db
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const carpeta = new URL("../migrations/", import.meta.url);
const db = new PGlite();

await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create function auth.jwt() returns jsonb language sql stable as $$
    select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  grant usage on schema public, auth to anon, authenticated;
  grant execute on all functions in schema auth to anon, authenticated;
  -- Supabase da por defecto todos los privilegios a anon y authenticated:
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
  create publication supabase_realtime;
`);

for (const f of readdirSync(carpeta).sort()) {
  await db.exec(readFileSync(new URL(f, carpeta), "utf8"));
  console.log('aplicada', f);
}

const U = {
  A: '00000000-0000-0000-0000-00000000000a',
  B: '00000000-0000-0000-0000-00000000000b',
  C: '00000000-0000-0000-0000-00000000000c',
  D: '00000000-0000-0000-0000-00000000000d',
  E: '00000000-0000-0000-0000-00000000000e',
  F: '00000000-0000-0000-0000-00000000000f',
  M: '00000000-0000-0000-0000-0000000000aa', // moderador con correo
  N: '00000000-0000-0000-0000-0000000000ab', // moderador, pero entra como anónimo
};
for (const id of Object.values(U)) await db.query('insert into auth.users values ($1)', [id]);
await db.query(`insert into public.moderadores (user_id, sector) values ($1, 'martin-sanchez'), ($2, null)`, [U.M, U.N]);

async function como(usuario, fn, { anonimo = true } = {}) {
  return db.transaction(async (tx) => {
    if (usuario) {
      await tx.query(`select set_config('request.jwt.claim.sub', $1, true), set_config('request.jwt.claims', $2, true)`, [
        usuario,
        JSON.stringify({ sub: usuario, is_anonymous: anonimo }),
      ]);
      await tx.exec('set local role authenticated');
    } else {
      await tx.exec('set local role anon');
    }
    return fn(tx);
  });
}
const falla = async (promesa, patron, nombre) => {
  await assert.rejects(promesa, (e) => patron.test(`${e.code} ${e.message}`), nombre);
  console.log('  ok (rechazado):', nombre);
};
const ok = (nombre) => console.log('  ok:', nombre);
const reportar = (u, sector, tipo, descripcion) =>
  como(u, (tx) => tx.query('insert into public.reportes (sector, tipo, descripcion) values ($1, $2, $3)', [sector, tipo, descripcion]));
const votar = (u, id, voto) =>
  como(u, (tx) => tx.query('insert into public.confirmaciones (reporte_id, voto) values ($1, $2)', [id, voto]));
const alerta = async (u, id) => (await como(u, (tx) => tx.query('select * from public.alertas where id = $1', [id]))).rows[0];
const idDe = async (descripcion) =>
  (await db.query('select id from public.reportes where descripcion = $1', [descripcion])).rows[0].id;

console.log('\n1. Crear reporte y campos protegidos');
await reportar(U.A, 'martin-sanchez', 'crecida', 'El río subió detrás del puente');
const r1 = await idDe('El río subió detrás del puente');
ok('un vecino con sesión crea un reporte');
await falla(
  como(U.A, (tx) => tx.query(`insert into public.reportes (sector, tipo, descripcion, validado_en) values ('valle-dorado', 'crecida', 'Intento validarme solo', now())`)),
  /42501|permission denied/,
  'no puede escribir validado_en al crear',
);
await falla(reportar(null, 'valle-dorado', 'crecida', 'Sin sesión no se reporta'), /42501|permission denied/, 'anon sin sesión no reporta');
await falla(reportar(U.A, 'otro-sector', 'crecida', 'Sector inventado aquí'), /23514|violates check/, 'sector fuera del catálogo');
await falla(reportar(U.A, 'valle-dorado', 'crecida', 'Llamen al 6123-4567 ya'), /23514|descripcion_sin_telefono/, 'descripción con teléfono');
await falla(reportar(U.A, 'valle-dorado', 'crecida', 'corto'), /23514|descripcion_largo/, 'descripción muy corta');

console.log('\n2. Semáforo por confirmaciones');
assert.equal((await alerta(U.B, r1)).nivel, 1); ok('nivel 1 al crearse');
await falla(votar(U.A, r1, 'confirma'), /voto_propio/, 'quien reporta no confirma lo suyo');
await votar(U.B, r1, 'confirma');
assert.equal((await alerta(U.B, r1)).nivel, 1); ok('1 confirmación sigue en nivel 1');
await votar(U.C, r1, 'confirma');
assert.equal((await alerta(U.B, r1)).nivel, 2); ok('2 confirmaciones en < 30 min: nivel 2');
await falla(votar(U.B, r1, 'falso'), /23505|un_voto_por_persona/, 'una persona, un voto');
await votar(U.D, r1, 'confirma');
const a1 = await alerta(U.B, r1);
assert.equal(a1.nivel, 3); assert.equal(a1.confirmaciones, 3); ok('3 confirmaciones: nivel 3');
assert.equal(a1.es_mio, false); assert.equal((await alerta(U.A, r1)).es_mio, true); ok('es_mio solo para quien reportó');

console.log('\n3. Regla de 30 minutos y votos falsos');
await reportar(U.A, 'valle-dorado', 'via-cerrada', 'Árbol caído en la entrada principal');
const r2 = await idDe('Árbol caído en la entrada principal');
await db.query(`update public.reportes set creado_en = now() - interval '40 minutes' where id = $1`, [r2]);
await votar(U.B, r2, 'confirma');
await votar(U.C, r2, 'confirma');
assert.equal((await alerta(U.B, r2)).nivel, 1); ok('2 confirmaciones después de 30 min no suben a nivel 2');
await reportar(U.B, 'villa-del-campo', 'corte-agua', 'No hay agua en la calle principal');
const r3 = await idDe('No hay agua en la calle principal');
await votar(U.C, r3, 'confirma');
await votar(U.D, r3, 'confirma');
assert.equal((await alerta(U.A, r3)).nivel, 2);
await votar(U.E, r3, 'falso');
await votar(U.F, r3, 'falso');
assert.equal((await alerta(U.A, r3)).nivel, 2); ok('falsos iguales a confirmaciones: no baja');
await votar(U.A, r3, 'falso');
assert.equal((await alerta(U.A, r3)).nivel, 1); ok('falsos superan confirmaciones: baja un nivel');

console.log('\n4. Privacidad');
await falla(como(U.B, (tx) => tx.query('select user_id from public.reportes')), /42501|permission denied/, 'nadie lee user_id de reportes');
await falla(como(U.B, (tx) => tx.query('select user_id from public.confirmaciones')), /42501|permission denied/, 'nadie lee user_id de confirmaciones');
const votosB = await como(U.B, (tx) => tx.query('select reporte_id, voto from public.confirmaciones'));
assert.ok(votosB.rows.length > 0 && votosB.rows.length < 6); ok(`B ve solo sus ${votosB.rows.length} votos`);
const anonLee = await como(null, (tx) => tx.query('select id, nivel from public.alertas'));
assert.ok(anonLee.rows.length >= 3); ok('visitante sin sesión puede leer alertas');
await reportar(U.A, 'martin-sanchez', 'traslado', 'Cita a las dos en el hospital');
const t1 = await idDe('Cita a las dos en el hospital');
assert.equal(await alerta(U.B, t1), undefined); ok('otro vecino no ve el traslado');
assert.equal(await alerta(null, t1), undefined); ok('visitante sin sesión no ve el traslado');
assert.equal((await alerta(U.A, t1)).es_mio, true); ok('quien lo pidió ve su traslado');
assert.ok(await como(U.M, (tx) => tx.query('select 1 from public.alertas where id = $1', [t1]).then((r) => r.rows[0]), { anonimo: false }));
ok('moderador del sector ve el traslado');
await falla(votar(U.B, t1, 'confirma'), /traslado_no_se_vota|reporte_inexistente/, 'traslados no se votan');

console.log('\n5. Moderación');
await falla(como(U.B, (tx) => tx.query('update public.reportes set validado_en = now()')), /42501|permission denied/, 'un vecino no puede actualizar reportes');
await falla(como(U.B, (tx) => tx.query('delete from public.reportes')), /42501|permission denied/, 'un vecino no puede borrar reportes');
await falla(como(U.B, (tx) => tx.query('select public.validar_reporte($1)', [r2])), /solo_moderadores/, 'un vecino no valida');
await falla(como(U.N, (tx) => tx.query('select public.validar_reporte($1)', [r2])), /solo_moderadores/, 'un moderador en sesión anónima no valida');
await falla(como(U.M, (tx) => tx.query('select public.validar_reporte($1)', [r2]), { anonimo: false }), /solo_moderadores/, 'moderador de otro sector no valida');
await como(U.N, (tx) => tx.query('select public.validar_reporte($1)', [r2]), { anonimo: false });
assert.equal((await alerta(U.B, r2)).nivel, 3); ok('moderador valida: nivel 3');
await falla(
  como(U.M, (tx) => tx.query(`select public.marcar_oficial($1, 'SINAPROC', 'http://no-seguro.example')`, [r1]), { anonimo: false }),
  /23514|check/,
  'el enlace oficial debe ser https',
);
await falla(
  como(U.M, (tx) => tx.query(`select public.marcar_oficial($1, 'Periódico', 'https://x.example')`, [r1]), { anonimo: false }),
  /23514|check/,
  'la fuente debe ser SINAPROC, IDAAN o Municipio',
);
await como(U.M, (tx) => tx.query(`select public.marcar_oficial($1, 'SINAPROC', 'https://www.sinaproc.gob.pa/aviso')`, [r1]), { anonimo: false });
assert.equal((await alerta(U.B, r1)).nivel, 4); ok('moderador marca oficial: nivel 4');
await como(U.M, (tx) => tx.query(`select public.responder_traslado($1, 'Un vecino sale a la 1:30 desde la entrada')`, [t1]), { anonimo: false });
assert.match((await alerta(U.A, t1)).nota_moderador, /entrada/); ok('quien pidió el traslado ve la respuesta');

console.log('\n6. Caducidad, límite y cifras');
await db.query(`update public.reportes set creado_en = now() - interval '3 hours', ultima_confirmacion = now() - interval '150 minutes' where id = $1`, [r3]);
assert.equal((await alerta(U.B, r3)).archivada, true); ok('2 horas sin confirmaciones: archivada');
await falla(votar(U.F, r3, 'confirma'), /alerta_archivada|23505/, 'no se vota una alerta archivada');
await db.query(`update public.reportes set creado_en = now() - interval '5 hours' where id = $1`, [r1]);
assert.equal((await alerta(U.B, r1)).archivada, false); ok('una alerta oficial no caduca sola');
const yaTiene = Number((await db.query(`select count(*) from public.reportes where user_id = $1 and creado_en > now() - interval '1 hour'`, [U.A])).rows[0].count);
for (let i = yaTiene; i < 5; i++) await reportar(U.A, 'valle-dorado', 'crecida', `Reporte de relleno número ${i}`);
await falla(reportar(U.A, 'valle-dorado', 'crecida', 'El sexto reporte en una hora'), /limite_reportes/, 'máximo 5 reportes por hora');
const cifras = (await como(null, (tx) => tx.query('select public.estadisticas() as e'))).rows[0].e;
assert.ok(cifras.alertas_confirmadas >= 2 && cifras.vecinos >= 6); ok(`estadísticas públicas ${JSON.stringify(cifras)}`);
await falla(como(null, (tx) => tx.query('select public.antes_de_votar()')), /42501|permission denied|trigger/, 'no se llaman funciones internas');

const antes = (await db.query('select cambiado_en from public.version_alertas')).rows[0].cambiado_en;
await new Promise((r) => setTimeout(r, 20));
await reportar(U.F, 'nicolas-solano', 'crecida', 'La quebrada se está llenando');
const despues = (await db.query('select cambiado_en from public.version_alertas')).rows[0].cambiado_en;
assert.ok(despues > antes); ok('cada cambio actualiza la marca de tiempo real');

console.log('\nTodas las pruebas pasaron.');
