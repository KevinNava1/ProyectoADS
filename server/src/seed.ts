import { randomUUID } from 'crypto';
import { db, totalRegistros } from './db';
import { ESTACIONES_L1 } from './data/estaciones';
import { PERFIL_DEMANDA } from './data/simulation';
import { TipoEvento } from './types/models';

/**
 * Siembra (seed) la base con eventos de torniquete de HOY, siguiendo el perfil
 * de demanda por hora (dos horas pico: ~8:00 y ~18:00). Así el histórico que
 * consulta la app proviene de eventos realmente almacenados, no inventados al
 * vuelo: el backend luego los agrega en métricas de afluencia.
 */
function inicioDelDia(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function sembrar(): number {
  const insert = db.prepare(
    'INSERT INTO registro_acceso (id, estacion_id, tipo, ts, hora) VALUES (?, ?, ?, ?, ?)',
  );

  const dia = inicioDelDia();
  let total = 0;

  const tx = db.transaction(() => {
    for (const estacion of ESTACIONES_L1) {
      // Factor de tamaño de la estación (terminales mueven más gente).
      const escala = estacion.capacidadAnden / 200;

      for (let hora = 5; hora <= 23; hora++) {
        const demanda = PERFIL_DEMANDA[hora];
        const jitter = 0.85 + Math.random() * 0.3;
        const entradas = Math.round(demanda * 130 * escala * jitter);
        const salidas = Math.round(demanda * 110 * escala * jitter);

        const emitir = (cantidad: number, tipo: TipoEvento) => {
          for (let i = 0; i < cantidad; i++) {
            // Repartimos el evento en algún momento aleatorio de esa hora.
            const ts =
              dia + hora * 3_600_000 + Math.floor(Math.random() * 3_600_000);
            insert.run(randomUUID(), estacion.id, tipo, ts, hora);
            total++;
          }
        };

        emitir(entradas, TipoEvento.ENTRADA);
        emitir(salidas, TipoEvento.SALIDA);
      }
    }
  });

  tx();
  return total;
}

/** Siembra solo si la tabla está vacía (idempotente). */
export function sembrarSiVacio(): void {
  if (totalRegistros() === 0) {
    const n = sembrar();
    console.log(`🌱 Base sembrada con ${n} registros de acceso (torniquetes).`);
  }
}

// Permite ejecutar `npm run seed` para resembrar manualmente.
if (require.main === module) {
  db.exec('DELETE FROM registro_acceso');
  const n = sembrar();
  console.log(`🌱 Resembrado: ${n} registros de acceso.`);
}
