const relativo = new Intl.RelativeTimeFormat('es-PA', { numeric: 'auto' });

export function haceCuanto(fechaIso, ahora = Date.now()) {
  const minutos = Math.round((new Date(fechaIso).getTime() - ahora) / 60_000);
  if (Math.abs(minutos) < 1) return 'hace un momento';
  if (Math.abs(minutos) < 60) return relativo.format(minutos, 'minute');
  return relativo.format(Math.round(minutos / 60), 'hour');
}

export function horaCorta(fechaIso) {
  return new Date(fechaIso).toLocaleTimeString('es-PA', { hour: 'numeric', minute: '2-digit' });
}
