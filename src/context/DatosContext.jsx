import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { configurado } from '../lib/supabase.js';
import * as api from '../services/alertas.js';
import { crearAlertasEjemplo, ESTADISTICAS_EJEMPLO } from '../data/alertasEjemplo.js';

export const MODO = configurado ? 'en-vivo' : 'demo';

const DatosContext = createContext(null);

// shortcut: en modo demostración el nivel se recalcula aquí solo para mostrar la
// animación; en vivo lo calcula la vista public.alertas y este código no corre.
function nivelDemo(a) {
  if (a.fuente) return 4;
  const base = a.confirmaciones >= 3 ? 3 : a.confirmaciones >= 2 ? 2 : 1;
  return a.falsos > a.confirmaciones ? Math.max(base - 1, 1) : base;
}

export function DatosProvider({ children }) {
  const enVivo = MODO === 'en-vivo';
  const [alertas, setAlertas] = useState(() => (enVivo ? [] : crearAlertasEjemplo()));
  const [misVotos, setMisVotos] = useState({});
  const [estadisticas, setEstadisticas] = useState(enVivo ? null : ESTADISTICAS_EJEMPLO);
  const [cargando, setCargando] = useState(enVivo);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    if (!enVivo) return;
    try {
      const [lista, stats] = await Promise.all([api.listarAlertas(), api.obtenerEstadisticas()]);
      setAlertas(lista);
      setEstadisticas(stats);
      setError(null);
    } catch (e) {
      setError(api.mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, [enVivo]);

  useEffect(() => {
    if (!enVivo) return;
    recargar();
    // Si este navegador ya participó antes, se recuperan sus votos y "es_mio".
    api
      .sesionActual()
      .then((sesion) => sesion && Promise.all([recargar(), api.listarMisVotos().then(setMisVotos)]))
      .catch((e) => setError(api.mensajeError(e)));

    let espera;
    const cancelar = api.suscribirCambios(() => {
      clearTimeout(espera);
      espera = setTimeout(recargar, 250);
    });
    return () => {
      clearTimeout(espera);
      cancelar();
    };
  }, [enVivo, recargar]);

  const votar = useCallback(
    async (id, voto) => {
      if (!enVivo) {
        setMisVotos((v) => ({ ...v, [id]: voto }));
        setAlertas((lista) =>
          lista.map((a) => {
            if (a.id !== id) return a;
            const nueva = {
              ...a,
              confirmaciones: a.confirmaciones + (voto === 'confirma' ? 1 : 0),
              falsos: a.falsos + (voto === 'falso' ? 1 : 0),
            };
            return { ...nueva, nivel: nivelDemo(nueva) };
          }),
        );
        return null;
      }
      try {
        await api.asegurarSesion();
        await api.votar(id, voto);
        setMisVotos((v) => ({ ...v, [id]: voto }));
        await recargar();
        return null;
      } catch (e) {
        return api.mensajeError(e);
      }
    },
    [enVivo, recargar],
  );

  const reportar = useCallback(
    async (datos) => {
      if (!enVivo) {
        const nueva = {
          id: `ej-${Date.now()}`,
          ...datos,
          descripcion: datos.descripcion.trim(),
          nivel: 1,
          confirmaciones: 0,
          falsos: 0,
          creadoEn: new Date().toISOString(),
          fuente: null,
          esMio: true,
          ejemplo: true,
        };
        setAlertas((lista) => [nueva, ...lista]);
        return null;
      }
      try {
        await api.asegurarSesion();
        await api.crearReporte(datos);
        await recargar();
        return null;
      } catch (e) {
        return api.mensajeError(e);
      }
    },
    [enVivo, recargar],
  );

  const valor = useMemo(
    () => ({ modo: MODO, alertas, misVotos, estadisticas, cargando, error, votar, reportar, recargar }),
    [alertas, misVotos, estadisticas, cargando, error, votar, reportar, recargar],
  );

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

export const useDatos = () => useContext(DatosContext);
