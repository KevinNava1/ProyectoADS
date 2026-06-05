import Database from 'better-sqlite3';
import path from 'path';

/**
 * Capa de base de datos (SQLite con better-sqlite3).
 *
 * La tabla `registro_acceso` modela la entidad RegistroAcceso del diagrama:
 * cada fila es un evento de torniquete (ENTRADA o SALIDA) en una estación.
 * El backend AGREGA estos eventos para producir las métricas de afluencia,
 * que es justamente lo que haría un sistema real conectado a los torniquetes.
 */
const DB_PATH = path.join(__dirname, '..', 'data.db');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS registro_acceso (
    id          TEXT PRIMARY KEY,
    estacion_id TEXT    NOT NULL,
    tipo        TEXT    NOT NULL,   -- 'ENTRADA' | 'SALIDA'
    ts          INTEGER NOT NULL,   -- marca de tiempo (epoch ms)
    hora        INTEGER NOT NULL    -- hora del día 0..23 (precalculada)
  );
  CREATE INDEX IF NOT EXISTS idx_ra_estacion_ts
    ON registro_acceso (estacion_id, ts);
  CREATE INDEX IF NOT EXISTS idx_ra_estacion_hora_tipo
    ON registro_acceso (estacion_id, hora, tipo);
`);

/** Número de filas en la tabla (para saber si ya está sembrada). */
export function totalRegistros(): number {
  const row = db.prepare('SELECT COUNT(*) AS c FROM registro_acceso').get() as {
    c: number;
  };
  return row.c;
}
