/** Funciones de formato de tiempo para la interfaz. */

/** Segundos restantes (>=0) entre dos instantes. */
export function segundosRestantes(objetivo: Date, ahora: Date): number {
  return Math.max(0, Math.round((objetivo.getTime() - ahora.getTime()) / 1000));
}

/** Formatea una cuenta regresiva en mm:ss (p. ej. "03:25"). */
export function formatCuentaRegresiva(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Texto corto de llegada: "Llegando", "1 min", "5 min". */
export function textoLlegada(segundos: number): string {
  if (segundos <= 20) return 'Llegando';
  const min = Math.round(segundos / 60);
  return `${min} min`;
}

/** Hora local en formato HH:mm. */
export function formatHora(fecha: Date): string {
  return fecha.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** "hace 12 s", "hace 1 min" — para el indicador de última actualización. */
export function formatHace(desde: Date, ahora: Date): string {
  const seg = Math.max(0, Math.round((ahora.getTime() - desde.getTime()) / 1000));
  if (seg < 60) return `hace ${seg} s`;
  const min = Math.floor(seg / 60);
  return `hace ${min} min`;
}
