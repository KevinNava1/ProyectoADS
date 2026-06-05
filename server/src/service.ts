import { ESTACIONES_L1 } from './data/estaciones';
import {
  clasificarNivel,
  generarEstadoEstacion,
} from './data/simulation';
import { conteoUltimaHora, entradasPorHora } from './repository';
import { Estacion, EstadoEstacion, NivelOcupacion } from './types/models';

/**
 * Capa de servicio: orquesta el dominio (simulación) y los datos persistidos
 * (repositorio) para construir las respuestas de la API.
 *
 * - Lo que SÍ vendría de sensores reales (entradas/salidas, gente en andén) se
 *   calcula a partir de los eventos almacenados en SQLite.
 * - Lo que NO tiene sensor en este prototipo (posición/ETA de las unidades) se
 *   sigue estimando con el motor de simulación.
 */

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function buscarEstacion(id: string): Estacion | undefined {
  return ESTACIONES_L1.find((e) => e.id === id);
}

/** Estado de afluencia de una estación, combinando BD + simulación. */
export function construirEstado(
  estacion: Estacion,
  ahora: Date,
): EstadoEstacion {
  // Próximas unidades: estimadas (no hay sensor de posición de autobuses).
  const sim = generarEstadoEstacion(estacion, ahora);

  // Personas en espera: derivada de eventos REALES de torniquete (última hora).
  const { entradas, salidas } = conteoUltimaHora(estacion.id, ahora.getTime());
  const personasEnEspera = clamp(
    Math.round(entradas * 0.8),
    2,
    estacion.capacidadAnden,
  );
  const saturacionPct = Math.round(
    (personasEnEspera / estacion.capacidadAnden) * 100,
  );
  const nivelAnden = clasificarNivel(saturacionPct);

  return {
    estacion,
    personasEnEspera,
    nivelAnden,
    saturacionPct,
    proximas: sim.proximas,
    metrica: {
      estacionId: estacion.id,
      timestamp: ahora,
      totalEntradas: entradas,
      totalSalidas: salidas,
      nivelOcupacion: nivelAnden,
    },
  };
}

export interface PuntoAfluencia {
  hora: number;
  valor: number;
  nivel: NivelOcupacion;
}

/** Perfil de afluencia por hora a partir de las ENTRADAS almacenadas. */
export function construirAfluencia(estacion: Estacion): PuntoAfluencia[] {
  const mapa = entradasPorHora(estacion.id);
  const horas: number[] = [];
  for (let h = 5; h <= 23; h++) horas.push(h);
  const maximo = Math.max(1, ...horas.map((h) => mapa.get(h) ?? 0));

  return horas.map((hora) => {
    const valor = mapa.get(hora) ?? 0;
    return {
      hora,
      valor,
      // Nivel relativo respecto al máximo del día.
      nivel: clasificarNivel((valor / maximo) * 100),
    };
  });
}

/** Resumen ligero (nivel + espera) de todas las estaciones, para el mapa. */
export function construirResumenTodas(ahora: Date) {
  return ESTACIONES_L1.map((estacion) => {
    const { entradas } = conteoUltimaHora(estacion.id, ahora.getTime());
    const personasEnEspera = clamp(
      Math.round(entradas * 0.8),
      2,
      estacion.capacidadAnden,
    );
    const saturacionPct = Math.round(
      (personasEnEspera / estacion.capacidadAnden) * 100,
    );
    return {
      id: estacion.id,
      personasEnEspera,
      nivelAnden: clasificarNivel(saturacionPct),
    };
  });
}
