import { db } from './db';

/**
 * Repositorio: consultas SQL que AGREGAN los eventos de torniquete
 * (registro_acceso) en métricas de afluencia. Aquí vive la "inteligencia"
 * de datos del backend.
 */

/** Entradas y salidas de una estación en la última hora (ventana móvil). */
export function conteoUltimaHora(
  estacionId: string,
  ahoraMs: number,
): { entradas: number; salidas: number } {
  const desde = ahoraMs - 3_600_000;
  const row = db
    .prepare(
      `SELECT
         SUM(CASE WHEN tipo = 'ENTRADA' THEN 1 ELSE 0 END) AS entradas,
         SUM(CASE WHEN tipo = 'SALIDA'  THEN 1 ELSE 0 END) AS salidas
       FROM registro_acceso
       WHERE estacion_id = ? AND ts BETWEEN ? AND ?`,
    )
    .get(estacionId, desde, ahoraMs) as {
    entradas: number | null;
    salidas: number | null;
  };
  return { entradas: row.entradas ?? 0, salidas: row.salidas ?? 0 };
}

/** Total de ENTRADAS por hora del día de una estación (para la gráfica). */
export function entradasPorHora(estacionId: string): Map<number, number> {
  const filas = db
    .prepare(
      `SELECT hora, COUNT(*) AS total
       FROM registro_acceso
       WHERE estacion_id = ? AND tipo = 'ENTRADA'
       GROUP BY hora
       ORDER BY hora`,
    )
    .all(estacionId) as { hora: number; total: number }[];

  const mapa = new Map<number, number>();
  for (const f of filas) mapa.set(f.hora, f.total);
  return mapa;
}
