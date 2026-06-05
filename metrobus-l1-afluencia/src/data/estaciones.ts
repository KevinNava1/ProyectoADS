import { Estacion } from '../types/models';

/**
 * Estaciones de la LÍNEA 1 del Metrobús de la CDMX (corredor Av. Insurgentes),
 * de norte (Indios Verdes) a sur (El Caminero). Son las 46 estaciones reales
 * del trazo, en su orden real.
 *
 * ⚠️ NOTA SOBRE LOS DATOS:
 * - El ORDEN y los NOMBRES de las estaciones son reales.
 * - La `capacidadAnden` (cuántas personas caben en el andén) es una
 *   ESTIMACIÓN para el prototipo; NO es un dato oficial (Metrobús no publica
 *   esa cifra por estación). Las terminales y estaciones de transbordo usan
 *   valores más altos; las intermedias, más bajos. Si se obtiene el dato real,
 *   basta con sustituir estos números.
 */
export const ESTACIONES_L1: Estacion[] = [
  { id: 'indios-verdes', nombre: 'Indios Verdes', ubicacion: 'Insurgentes Norte · Gustavo A. Madero', capacidadAnden: 340 },
  { id: 'deportivo-18-marzo', nombre: 'Deportivo 18 de Marzo', ubicacion: 'Insurgentes Norte · Gustavo A. Madero', capacidadAnden: 260 },
  { id: 'euzkaro', nombre: 'Euzkaro', ubicacion: 'Insurgentes Norte · Gustavo A. Madero', capacidadAnden: 150 },
  { id: 'potrero', nombre: 'Potrero', ubicacion: 'Insurgentes Norte · Gustavo A. Madero', capacidadAnden: 160 },
  { id: 'la-raza', nombre: 'La Raza', ubicacion: 'Insurgentes Norte · Cuauhtémoc', capacidadAnden: 240 },
  { id: 'circuito', nombre: 'Circuito', ubicacion: 'Insurgentes Norte · Cuauhtémoc', capacidadAnden: 150 },
  { id: 'san-simon', nombre: 'San Simón', ubicacion: 'Insurgentes Norte · Cuauhtémoc', capacidadAnden: 140 },
  { id: 'manuel-gonzalez', nombre: 'Manuel González', ubicacion: 'Insurgentes Norte · Cuauhtémoc', capacidadAnden: 160 },
  { id: 'buenavista', nombre: 'Buenavista', ubicacion: 'Insurgentes Centro · Cuauhtémoc', capacidadAnden: 300 },
  { id: 'el-chopo', nombre: 'El Chopo', ubicacion: 'Insurgentes Centro · Cuauhtémoc', capacidadAnden: 150 },
  { id: 'revolucion', nombre: 'Revolución', ubicacion: 'Insurgentes Centro · Cuauhtémoc', capacidadAnden: 180 },
  { id: 'plaza-republica', nombre: 'Plaza de la República', ubicacion: 'Insurgentes Centro · Cuauhtémoc', capacidadAnden: 170 },
  { id: 'reforma', nombre: 'Reforma', ubicacion: 'Insurgentes y Paseo de la Reforma · Cuauhtémoc', capacidadAnden: 280 },
  { id: 'hamburgo', nombre: 'Hamburgo', ubicacion: 'Insurgentes · Zona Rosa, Cuauhtémoc', capacidadAnden: 180 },
  { id: 'insurgentes', nombre: 'Insurgentes', ubicacion: 'Glorieta de Insurgentes · Cuauhtémoc', capacidadAnden: 260 },
  { id: 'durango', nombre: 'Durango', ubicacion: 'Insurgentes · Roma Norte, Cuauhtémoc', capacidadAnden: 160 },
  { id: 'alvaro-obregon', nombre: 'Álvaro Obregón', ubicacion: 'Insurgentes · Roma Norte, Cuauhtémoc', capacidadAnden: 170 },
  { id: 'sonora', nombre: 'Sonora', ubicacion: 'Insurgentes · Roma Sur, Cuauhtémoc', capacidadAnden: 150 },
  { id: 'campeche', nombre: 'Campeche', ubicacion: 'Insurgentes · Hipódromo, Cuauhtémoc', capacidadAnden: 150 },
  { id: 'chilpancingo', nombre: 'Chilpancingo', ubicacion: 'Insurgentes · Hipódromo, Cuauhtémoc', capacidadAnden: 190 },
  { id: 'nuevo-leon', nombre: 'Nuevo León', ubicacion: 'Insurgentes Sur · Hipódromo, Cuauhtémoc', capacidadAnden: 160 },
  { id: 'la-piedad', nombre: 'La Piedad', ubicacion: 'Insurgentes Sur · Benito Juárez', capacidadAnden: 150 },
  { id: 'poliforum', nombre: 'Poliforum', ubicacion: 'Insurgentes Sur · Benito Juárez', capacidadAnden: 160 },
  { id: 'napoles', nombre: 'Nápoles', ubicacion: 'Insurgentes Sur · Benito Juárez', capacidadAnden: 150 },
  { id: 'colonia-del-valle', nombre: 'Colonia del Valle', ubicacion: 'Insurgentes Sur · Benito Juárez', capacidadAnden: 170 },
  { id: 'ciudad-deportes', nombre: 'Ciudad de los Deportes', ubicacion: 'Insurgentes Sur · Benito Juárez', capacidadAnden: 200 },
  { id: 'parque-hundido', nombre: 'Parque Hundido', ubicacion: 'Insurgentes Sur · Benito Juárez', capacidadAnden: 180 },
  { id: 'felix-cuevas', nombre: 'Félix Cuevas', ubicacion: 'Insurgentes Sur · Benito Juárez', capacidadAnden: 190 },
  { id: 'rio-churubusco', nombre: 'Río Churubusco', ubicacion: 'Insurgentes Sur · Benito Juárez', capacidadAnden: 200 },
  { id: 'teatro-insurgentes', nombre: 'Teatro Insurgentes', ubicacion: 'Insurgentes Sur · Álvaro Obregón', capacidadAnden: 170 },
  { id: 'jose-maria-velasco', nombre: 'José María Velasco', ubicacion: 'Insurgentes Sur · Álvaro Obregón', capacidadAnden: 140 },
  { id: 'francia', nombre: 'Francia', ubicacion: 'Insurgentes Sur · Álvaro Obregón', capacidadAnden: 140 },
  { id: 'olivo', nombre: 'Olivo', ubicacion: 'Insurgentes Sur · Álvaro Obregón', capacidadAnden: 130 },
  { id: 'altavista', nombre: 'Altavista', ubicacion: 'Insurgentes Sur · Álvaro Obregón', capacidadAnden: 150 },
  { id: 'la-bombilla', nombre: 'La Bombilla', ubicacion: 'Insurgentes Sur · Álvaro Obregón', capacidadAnden: 170 },
  { id: 'doctor-galvez', nombre: 'Doctor Gálvez', ubicacion: 'Insurgentes Sur · Álvaro Obregón', capacidadAnden: 150 },
  { id: 'ciudad-universitaria', nombre: 'Ciudad Universitaria', ubicacion: 'Insurgentes Sur · Coyoacán', capacidadAnden: 280 },
  { id: 'ccu', nombre: 'Centro Cultural Universitario', ubicacion: 'Insurgentes Sur · Coyoacán', capacidadAnden: 200 },
  { id: 'perisur', nombre: 'Perisur', ubicacion: 'Insurgentes Sur · Coyoacán', capacidadAnden: 240 },
  { id: 'villa-olimpica', nombre: 'Villa Olímpica', ubicacion: 'Insurgentes Sur · Tlalpan', capacidadAnden: 170 },
  { id: 'corregidora', nombre: 'Corregidora', ubicacion: 'Insurgentes Sur · Tlalpan', capacidadAnden: 150 },
  { id: 'ayuntamiento', nombre: 'Ayuntamiento', ubicacion: 'Insurgentes Sur · Tlalpan', capacidadAnden: 150 },
  { id: 'fuentes-brotantes', nombre: 'Fuentes Brotantes', ubicacion: 'Insurgentes Sur · Tlalpan', capacidadAnden: 160 },
  { id: 'santa-ursula', nombre: 'Santa Úrsula', ubicacion: 'Insurgentes Sur · Tlalpan', capacidadAnden: 150 },
  { id: 'la-joya', nombre: 'La Joya', ubicacion: 'Insurgentes Sur · Tlalpan', capacidadAnden: 150 },
  { id: 'el-caminero', nombre: 'El Caminero', ubicacion: 'Insurgentes Sur · Tlalpan', capacidadAnden: 260 },
];

/** Línea a la que pertenecen todas las unidades del prototipo. */
export const LINEA = 'L1';
