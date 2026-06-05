/**
 * Modelo de datos del prototipo "Metrobús L1 – Afluencia".
 *
 * Estas interfaces y enumeraciones están basadas directamente en el
 * diagrama de clases del proyecto. NO hay backend: los objetos se
 * generan de forma simulada en el cliente (ver src/data/simulation.ts),
 * pero respetan esta estructura para que sea fácil mapearlos a una API real.
 */

/** Nivel de ocupación semántico (enumeración del diagrama). */
export enum NivelOcupacion {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
}

/** Tipo de evento registrado por un torniquete (enumeración del diagrama). */
export enum TipoEvento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}

/**
 * Estación de la Línea 1 del Metrobús.
 * Los "métodos lógicos" del diagrama (afluencia actual, personas en
 * espera, nivel) se calculan en simulation.ts a partir de estos datos.
 */
export interface Estacion {
  id: string;
  nombre: string;
  ubicacion: string;
  /** Capacidad máxima de personas que caben razonablemente en el andén. */
  capacidadAnden: number;
}

/** Unidad (autobús) que circula por la línea. */
export interface Unidad {
  id: string;
  capacidadMaxima: number;
  pasajerosABordo: number;
  linea: string;
}

/** Registro individual de acceso generado por un torniquete. */
export interface RegistroAcceso {
  id: string;
  timestamp: Date;
  tipo: TipoEvento;
  estacionId: string;
}

/** Métrica agregada (y anonimizada) de afluencia de una estación. */
export interface MetricaAfluencia {
  estacionId: string;
  timestamp: Date;
  totalEntradas: number;
  totalSalidas: number;
  nivelOcupacion: NivelOcupacion;
}

/* -------------------------------------------------------------------------- */
/* Tipos derivados (no están en el diagrama, son "vistas" para la UI)          */
/* -------------------------------------------------------------------------- */

/** Una unidad próxima a llegar, ya con su ETA y ocupación calculadas. */
export interface UnidadProxima {
  unidad: Unidad;
  /** Marca de tiempo absoluta estimada de llegada. */
  llegada: Date;
  /** Porcentaje de ocupación 0–100. */
  ocupacionPct: number;
  nivel: NivelOcupacion;
}

/** Estado de afluencia completo de una estación en un instante dado. */
export interface EstadoEstacion {
  estacion: Estacion;
  /** Personas aproximadas esperando en el andén. */
  personasEnEspera: number;
  /** Nivel de saturación del andén (gente esperando vs. capacidad). */
  nivelAnden: NivelOcupacion;
  /** Porcentaje de saturación del andén 0–100. */
  saturacionPct: number;
  /** Próximas unidades ordenadas por tiempo de llegada. */
  proximas: UnidadProxima[];
  /** Métrica agregada del instante actual. */
  metrica: MetricaAfluencia;
}
