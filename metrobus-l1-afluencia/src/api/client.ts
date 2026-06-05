import { API_URL } from '../config';
import { PuntoAfluencia } from '../data/simulation';
import { Estacion, EstadoEstacion, NivelOcupacion } from '../types/models';

/**
 * Cliente HTTP del backend. Las funciones devuelven EXACTAMENTE los mismos
 * tipos que usa la app (Estacion, EstadoEstacion, PuntoAfluencia), por lo que
 * las pantallas no notan la diferencia respecto al modo local.
 *
 * Como JSON no tiene tipo Date, aquí se "rehidratan" las fechas (las llegadas
 * de las unidades y los timestamps) a objetos Date.
 */

async function obtener<T>(ruta: string): Promise<T> {
  const resp = await fetch(`${API_URL}${ruta}`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} en ${ruta}`);
  return (await resp.json()) as T;
}

export function fetchEstaciones(): Promise<Estacion[]> {
  return obtener<Estacion[]>('/api/estaciones');
}

/** Resumen ligero (nivel + espera) de todas las estaciones, para el mapa. */
export interface ResumenEstacion {
  id: string;
  personasEnEspera: number;
  nivelAnden: NivelOcupacion;
}

export function fetchResumenEstados(): Promise<ResumenEstacion[]> {
  return obtener<ResumenEstacion[]>('/api/estados');
}

export async function fetchEstado(id: string): Promise<EstadoEstacion> {
  const e = await obtener<any>(`/api/estaciones/${id}/estado`);
  // Rehidratar fechas (JSON las entrega como string ISO).
  return {
    ...e,
    proximas: e.proximas.map((p: any) => ({
      ...p,
      llegada: new Date(p.llegada),
    })),
    metrica: { ...e.metrica, timestamp: new Date(e.metrica.timestamp) },
  } as EstadoEstacion;
}

export function fetchAfluencia(id: string): Promise<PuntoAfluencia[]> {
  return obtener<PuntoAfluencia[]>(`/api/estaciones/${id}/afluencia`);
}
