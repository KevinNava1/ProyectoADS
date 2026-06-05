import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { fetchEstado, fetchResumenEstados, ResumenEstacion } from '../api/client';
import { MODO_DATOS, USE_BACKEND } from '../config';
import { ESTACIONES_L1 } from '../data/estaciones';
import {
  Direccion,
  generarEstadoEstacion,
  sugerenciaHorario,
  Tendencia,
  tendenciaAfluencia,
} from '../data/simulation';
import { Estacion, EstadoEstacion } from '../types/models';

/** Cada cuántos milisegundos se "actualizan" los datos simulados (60 s). */
export const INTERVALO_ACTUALIZACION_MS = 60_000;
/** Cada cuánto se refresca el estado desde el backend (modo backend). */
const REFRESCO_BACKEND_MS = 15_000;

interface AppDataValue {
  estaciones: Estacion[];
  estacionActual: Estacion;
  setEstacionActualId: (id: string) => void;
  estacionFavoritaId: string | null;
  setEstacionFavoritaId: (id: string | null) => void;
  /** Dirección del recorrido seleccionada (afecta los tiempos de las unidades). */
  direccion: Direccion;
  setDireccion: (d: Direccion) => void;
  /** Reloj que avanza cada segundo (alimenta la cuenta regresiva). */
  ahora: Date;
  /** Marca de la última actualización periódica de datos. */
  ultimaActualizacion: Date;
  /** Estado de afluencia de la estación seleccionada. */
  estadoActual: EstadoEstacion;
  /** Calcula el estado de cualquier estación en el instante actual. */
  estadoDe: (estacion: Estacion) => EstadoEstacion;
  /** Tendencia de la afluencia (subiendo/bajando/estable). */
  tendencia: Tendencia;
  /** Sugerencia de "mejor momento para viajar" (o null). */
  sugerencia: string | null;
  /** Cargando datos por primera vez (relevante en modo backend). */
  cargando: boolean;
  /** Hubo error al contactar el backend (se usó respaldo local). */
  errorBackend: boolean;
  /** Fuerza un refresco de datos (pull-to-refresh). */
  refrescar: () => Promise<void>;
  /** Etiqueta del origen de datos activo (local o backend). */
  modoDatos: string;
}

const AppDataContext = createContext<AppDataValue | undefined>(undefined);

/**
 * Proveedor de datos de la app. Mantiene un reloj de 1 s para las cuentas
 * regresivas y refresca los datos periódicamente. Según `USE_BACKEND`
 * (src/config.ts), la fuente es la simulación local o la API REST.
 */
export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [estacionActualId, setEstacionActualId] = useState<string>(
    ESTACIONES_L1[0].id,
  );
  const [estacionFavoritaId, setEstacionFavoritaId] = useState<string | null>(
    null,
  );
  const [direccion, setDireccion] = useState<Direccion>('norte');
  const [ahora, setAhora] = useState<Date>(new Date());
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(
    new Date(),
  );
  const minutoRef = useRef<number>(
    Math.floor(Date.now() / INTERVALO_ACTUALIZACION_MS),
  );

  const [remoteEstado, setRemoteEstado] = useState<EstadoEstacion | null>(null);
  const [remoteResumen, setRemoteResumen] = useState<
    Record<string, ResumenEstacion>
  >({});
  const [errorBackend, setErrorBackend] = useState(false);

  // Reloj de 1 segundo (cuenta regresiva) + detección de nuevo intervalo.
  useEffect(() => {
    const id = setInterval(() => {
      const t = new Date();
      setAhora(t);
      const minuto = Math.floor(t.getTime() / INTERVALO_ACTUALIZACION_MS);
      if (minuto !== minutoRef.current) {
        minutoRef.current = minuto;
        setUltimaActualizacion(t);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const estacionActual = useMemo(
    () =>
      ESTACIONES_L1.find((e) => e.id === estacionActualId) ?? ESTACIONES_L1[0],
    [estacionActualId],
  );

  // --- Backend: resumen de todas las estaciones (mapa) ---
  const cargarResumen = useCallback(async () => {
    if (!USE_BACKEND) return;
    try {
      const lista = await fetchResumenEstados();
      const mapa: Record<string, ResumenEstacion> = {};
      for (const r of lista) mapa[r.id] = r;
      setRemoteResumen(mapa);
      setErrorBackend(false);
      setUltimaActualizacion(new Date());
    } catch {
      setErrorBackend(true);
    }
  }, []);

  // --- Backend: estado de la estación seleccionada ---
  const cargarEstado = useCallback(async () => {
    if (!USE_BACKEND) return;
    try {
      const e = await fetchEstado(estacionActual.id);
      setRemoteEstado(e);
      setErrorBackend(false);
    } catch {
      setRemoteEstado(null);
      setErrorBackend(true);
    }
  }, [estacionActual.id]);

  useEffect(() => {
    if (!USE_BACKEND) return;
    cargarResumen();
    const id = setInterval(cargarResumen, 30_000);
    return () => clearInterval(id);
  }, [cargarResumen]);

  useEffect(() => {
    if (!USE_BACKEND) return;
    cargarEstado();
    const id = setInterval(cargarEstado, REFRESCO_BACKEND_MS);
    return () => clearInterval(id);
  }, [cargarEstado]);

  // Refresco manual (pull-to-refresh).
  const refrescar = useCallback(async () => {
    if (USE_BACKEND) {
      await Promise.all([cargarResumen(), cargarEstado()]);
    } else {
      // Modo local: simulamos una breve recarga y re-sellamos la hora.
      await new Promise((r) => setTimeout(r, 550));
      setUltimaActualizacion(new Date());
    }
  }, [cargarResumen, cargarEstado]);

  // Estado de CUALQUIER estación: local (con dirección), override del backend.
  const estadoDe = useMemo(
    () =>
      (estacion: Estacion): EstadoEstacion => {
        const local = generarEstadoEstacion(estacion, ahora, direccion);
        if (USE_BACKEND) {
          const r = remoteResumen[estacion.id];
          if (r) {
            const saturacionPct = Math.round(
              (r.personasEnEspera / estacion.capacidadAnden) * 100,
            );
            return {
              ...local,
              personasEnEspera: r.personasEnEspera,
              nivelAnden: r.nivelAnden,
              saturacionPct,
            };
          }
        }
        return local;
      },
    [ahora, direccion, remoteResumen],
  );

  const estadoActual = useMemo(() => {
    if (
      USE_BACKEND &&
      remoteEstado &&
      remoteEstado.estacion.id === estacionActual.id
    ) {
      return remoteEstado;
    }
    return estadoDe(estacionActual);
  }, [estacionActual, ahora, remoteEstado, estadoDe]);

  const tendencia = useMemo(() => tendenciaAfluencia(ahora), [ahora]);
  const sugerencia = useMemo(() => sugerenciaHorario(ahora), [ahora]);
  const cargando = USE_BACKEND && !remoteEstado && !errorBackend;

  const value: AppDataValue = {
    estaciones: ESTACIONES_L1,
    estacionActual,
    setEstacionActualId,
    estacionFavoritaId,
    setEstacionFavoritaId,
    direccion,
    setDireccion,
    ahora,
    ultimaActualizacion,
    estadoActual,
    estadoDe,
    tendencia,
    sugerencia,
    cargando,
    errorBackend,
    refrescar,
    modoDatos: MODO_DATOS,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

/** Hook para consumir los datos de la app. */
export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData debe usarse dentro de AppDataProvider');
  return ctx;
}
