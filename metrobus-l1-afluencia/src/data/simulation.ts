import {
  Estacion,
  EstadoEstacion,
  MetricaAfluencia,
  NivelOcupacion,
  Unidad,
  UnidadProxima,
} from '../types/models';
import { LINEA } from './estaciones';

/**
 * Motor de simulación del prototipo.
 *
 * No hay sensores ni datos en tiempo real: todo se genera aquí a partir de
 * un "perfil de demanda" por hora del día (curva típica de un día laboral en
 * Insurgentes) más variaciones pseudoaleatorias DETERMINISTAS. Determinista
 * significa que, para un mismo instante y estación, el resultado es estable
 * (no parpadea entre renders), pero cambia de forma realista con el tiempo.
 */

/**
 * Capacidad máxima de pasajeros por unidad.
 *
 * 160 es la capacidad aproximada REAL de una unidad ARTICULADA del Metrobús.
 * (Nota: la Línea 1 también opera unidades BIARTICULADAS de ~240 pasajeros;
 *  para el prototipo se usa un solo valor por simplicidad. Si se quiere
 *  modelar la mezcla, basta variar esta capacidad por unidad.)
 */
export const CAPACIDAD_UNIDAD = 160;

/**
 * Perfil de demanda por hora (índice 0–23) en escala 0–1.
 * Refleja dos horas pico: ~8:00 (entrada laboral) y ~18:00 (salida).
 */
export const PERFIL_DEMANDA: number[] = [
  0.05, 0.04, 0.03, 0.03, 0.05, 0.18, 0.45, 0.8, 0.95, 0.85, // 0–9
  0.6, 0.5, 0.5, 0.55, 0.6, 0.6, 0.68, 0.82, 0.95, 0.9, //      10–19
  0.7, 0.5, 0.35, 0.2, //                                       20–23
];

/* -------------------------------------------------------------------------- */
/* Utilidades                                                                  */
/* -------------------------------------------------------------------------- */

/** Generador pseudoaleatorio determinista a partir de una semilla numérica. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x); // 0..1
}

/** Convierte un texto (id de estación) en una semilla numérica estable. */
function seedDeTexto(texto: string): number {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) % 100000;
  }
  return h;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Demanda interpolada para una hora con decimales (suaviza la curva). */
export function demandaEnHora(horaDecimal: number): number {
  const h0 = Math.floor(horaDecimal) % 24;
  const h1 = (h0 + 1) % 24;
  const frac = horaDecimal - Math.floor(horaDecimal);
  return PERFIL_DEMANDA[h0] * (1 - frac) + PERFIL_DEMANDA[h1] * frac;
}

/**
 * Clasifica un porcentaje de ocupación (0–100) en un nivel semántico.
 * Regla del enunciado: <40% = BAJA, 40–75% = MEDIA, >75% = ALTA.
 */
export function clasificarNivel(porcentaje: number): NivelOcupacion {
  if (porcentaje < 40) return NivelOcupacion.BAJA;
  if (porcentaje <= 75) return NivelOcupacion.MEDIA;
  return NivelOcupacion.ALTA;
}

/* -------------------------------------------------------------------------- */
/* Frecuencia de paso (headway) y horario de unidades                          */
/* -------------------------------------------------------------------------- */

/**
 * Minutos entre unidades según la demanda de la hora: a mayor demanda, más
 * unidades en servicio y por tanto menor intervalo (entre ~3 y ~9 min).
 * `semillaEstacion` añade una pequeña variación estable por estación.
 */
function headwayMinutos(hora: number, semillaEstacion: number): number {
  const demanda = PERFIL_DEMANDA[hora % 24];
  const base = 9 - 6 * demanda; // 3 min (pico) .. 9 min (valle)
  const variacion = (pseudoRandom(semillaEstacion + hora) - 0.5) * 1.2;
  return clamp(base + variacion, 2.5, 11);
}

function inicioDelDia(fecha: Date): number {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Calcula las marcas de tiempo ABSOLUTAS de las próximas `cantidad` unidades.
 * Como el horario se reconstruye desde el inicio del día con intervalos
 * deterministas, los tiempos de llegada no cambian entre renders: la cuenta
 * regresiva baja suavemente y, al pasar una unidad, la siguiente ocupa su lugar.
 */
function proximasLlegadas(
  ahora: Date,
  semillaEstacion: number,
  cantidad: number,
  desfaseDireccion = 0,
): Date[] {
  const desfase =
    (pseudoRandom(semillaEstacion) * 6 + 1) * 60_000 + desfaseDireccion; // 1–7 min
  let t = inicioDelDia(ahora) + desfase;
  const llegadas: Date[] = [];
  const ahoraMs = ahora.getTime();
  let guarda = 0;
  while (llegadas.length < cantidad && guarda < 4000) {
    if (t > ahoraMs) llegadas.push(new Date(t));
    const hora = new Date(t).getHours();
    t += headwayMinutos(hora, semillaEstacion) * 60_000;
    guarda++;
  }
  return llegadas;
}

/* -------------------------------------------------------------------------- */
/* Cálculo de ocupación de unidades y de personas en espera                    */
/* -------------------------------------------------------------------------- */

/** Construye una unidad con su ocupación estimada para una llegada dada. */
function construirUnidadProxima(
  llegada: Date,
  indice: number,
  semillaEstacion: number,
): UnidadProxima {
  const demanda = demandaEnHora(
    llegada.getHours() + llegada.getMinutes() / 60,
  );
  // Semilla estable por unidad (cambia entre unidades pero no entre renders).
  const semilla = semillaEstacion + Math.floor(llegada.getTime() / 60_000);
  const variacion = pseudoRandom(semilla) - 0.5;
  const fraccion = clamp(demanda * 0.92 + variacion * 0.3, 0.08, 0.98);
  const pasajerosABordo = Math.round(CAPACIDAD_UNIDAD * fraccion);
  const ocupacionPct = Math.round((pasajerosABordo / CAPACIDAD_UNIDAD) * 100);

  const unidad: Unidad = {
    id: `MB-${LINEA}-${String(1000 + (semilla % 900) + indice)}`,
    capacidadMaxima: CAPACIDAD_UNIDAD,
    pasajerosABordo,
    linea: LINEA,
  };

  return {
    unidad,
    llegada,
    ocupacionPct,
    nivel: clasificarNivel(ocupacionPct),
  };
}

/**
 * Genera el estado completo de afluencia de una estación en un instante.
 * Las personas en espera y las métricas usan una semilla por MINUTO para que
 * se "actualicen" en cada recálculo periódico (ver AppDataContext).
 */
export type Direccion = 'norte' | 'sur';

export function generarEstadoEstacion(
  estacion: Estacion,
  ahora: Date,
  direccion: Direccion = 'norte',
): EstadoEstacion {
  const semillaEstacion = seedDeTexto(estacion.id);
  const horaDecimal = ahora.getHours() + ahora.getMinutes() / 60;
  const demanda = demandaEnHora(horaDecimal);

  // --- Personas esperando en el andén ---
  const semillaMinuto = semillaEstacion + Math.floor(ahora.getTime() / 60_000);
  const varEspera = pseudoRandom(semillaMinuto);
  const personasEnEspera = Math.round(
    clamp(
      estacion.capacidadAnden * 0.55 * demanda * (0.7 + 0.6 * varEspera),
      2,
      estacion.capacidadAnden,
    ),
  );
  const saturacionPct = Math.round(
    (personasEnEspera / estacion.capacidadAnden) * 100,
  );
  const nivelAnden = clasificarNivel(saturacionPct);

  // --- Próximas unidades (el desfase por dirección cambia los tiempos) ---
  const desfaseDireccion = direccion === 'sur' ? 95_000 : 0;
  const llegadas = proximasLlegadas(ahora, semillaEstacion, 4, desfaseDireccion);
  const proximas = llegadas.map((ll, i) =>
    construirUnidadProxima(ll, i, semillaEstacion),
  );

  // --- Métrica agregada y anonimizada del intervalo ---
  const totalEntradas = Math.round(
    demanda * 90 * (0.8 + 0.5 * pseudoRandom(semillaMinuto + 1)),
  );
  const totalSalidas = Math.round(
    demanda * 75 * (0.8 + 0.5 * pseudoRandom(semillaMinuto + 2)),
  );
  const metrica: MetricaAfluencia = {
    estacionId: estacion.id,
    timestamp: ahora,
    totalEntradas,
    totalSalidas,
    nivelOcupacion: nivelAnden,
  };

  return {
    estacion,
    personasEnEspera,
    nivelAnden,
    saturacionPct,
    proximas,
    metrica,
  };
}

/** Un punto de la gráfica de afluencia histórica por horario. */
export interface PuntoAfluencia {
  hora: number; // 0–23
  valor: number; // afluencia estimada (personas)
  nivel: NivelOcupacion;
}

/**
 * Perfil de afluencia por horario (5:00–23:00) de una estación, usado en la
 * gráfica del detalle. Es estable por estación (representa su "día típico").
 */
export function perfilAfluenciaPorHora(estacion: Estacion): PuntoAfluencia[] {
  const semillaEstacion = seedDeTexto(estacion.id);
  const puntos: PuntoAfluencia[] = [];
  for (let h = 5; h <= 23; h++) {
    const variacion = 0.85 + 0.3 * pseudoRandom(semillaEstacion + h * 7);
    const fraccion = clamp(PERFIL_DEMANDA[h] * variacion, 0, 1);
    const valor = Math.round(estacion.capacidadAnden * 0.6 * fraccion);
    puntos.push({
      hora: h,
      valor,
      nivel: clasificarNivel(fraccion * 100),
    });
  }
  return puntos;
}

/** Tendencia de la afluencia respecto a un rato antes. */
export type Tendencia = 'subiendo' | 'bajando' | 'estable';

/**
 * Compara la demanda actual con la de hace ~30 min para saber si la afluencia
 * va en aumento, bajando o estable (sirve para mostrar una flecha ↑/↓).
 */
export function tendenciaAfluencia(ahora: Date): Tendencia {
  const h = ahora.getHours() + ahora.getMinutes() / 60;
  const actual = demandaEnHora(h);
  const antes = demandaEnHora((h - 0.5 + 24) % 24);
  const diff = actual - antes;
  if (diff > 0.04) return 'subiendo';
  if (diff < -0.04) return 'bajando';
  return 'estable';
}

/**
 * Sugerencia simple de "mejor momento para viajar": si ahora hay demanda alta,
 * propone la próxima hora (dentro de las siguientes 5) con demanda baja.
 */
export function sugerenciaHorario(ahora: Date): string | null {
  const h = ahora.getHours();
  if (PERFIL_DEMANDA[h] < 0.7) return null; // ya hay buen momento
  for (let i = 1; i <= 5; i++) {
    const hh = (h + i) % 24;
    if (PERFIL_DEMANDA[hh] <= 0.55) {
      return `Mejor viajar después de las ${String(hh).padStart(2, '0')}:00`;
    }
  }
  return null;
}
