import { Router } from 'express';
import { ESTACIONES_L1 } from './data/estaciones';
import {
  buscarEstacion,
  construirAfluencia,
  construirEstado,
  construirResumenTodas,
} from './service';

/**
 * Rutas REST de la API. El contrato (forma de los datos) es el mismo que la app
 * ya consume, por lo que cambiar de "datos locales" a "backend" no obliga a
 * reescribir las pantallas.
 */
export const router = Router();

// Estado de salud / información del servicio.
router.get('/health', (_req, res) => {
  res.json({ ok: true, servicio: 'Metrobús L1 – Afluencia', ahora: new Date() });
});

// Catálogo de estaciones (norte → sur).
router.get('/estaciones', (_req, res) => {
  res.json(ESTACIONES_L1);
});

// Resumen (nivel + espera) de todas las estaciones — para el mapa.
router.get('/estados', (_req, res) => {
  res.json(construirResumenTodas(new Date()));
});

// Estado de afluencia completo de una estación.
router.get('/estaciones/:id/estado', (req, res) => {
  const estacion = buscarEstacion(req.params.id);
  if (!estacion) return res.status(404).json({ error: 'Estación no encontrada' });
  res.json(construirEstado(estacion, new Date()));
});

// Perfil de afluencia por horario (agregado desde los torniquetes).
router.get('/estaciones/:id/afluencia', (req, res) => {
  const estacion = buscarEstacion(req.params.id);
  if (!estacion) return res.status(404).json({ error: 'Estación no encontrada' });
  res.json(construirAfluencia(estacion));
});
