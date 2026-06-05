/**
 * Configuración de la fuente de datos.
 *
 * - `USE_BACKEND = false` → la app usa la simulación LOCAL (offline). Ideal para
 *   exponer sin depender de red ni del servidor. Es el modo por defecto.
 * - `USE_BACKEND = true`  → la app consume el backend REST (Express + SQLite).
 *
 * Cambiar entre un modo y otro NO requiere tocar pantallas ni componentes:
 * toda la conmutación vive en AppDataContext. Esa es la flexibilidad de tener
 * la fuente de datos detrás de una sola capa.
 */
export const USE_BACKEND = false;

/**
 * URL base del backend.
 * - Web / emulador Android / simulador iOS:  http://localhost:4000
 * - Celular físico con Expo Go: reemplaza por la IP LAN de tu PC,
 *   p. ej. 'http://192.168.1.50:4000' (mismo wifi).
 */
export const API_URL = 'http://localhost:4000';

/** Etiqueta legible del modo actual (para mostrar en la UI). */
export const MODO_DATOS = USE_BACKEND ? 'Backend (API + SQLite)' : 'Local (simulado)';
