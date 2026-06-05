import { NivelOcupacion } from '../types/models';

/**
 * Sistema de color de la app.
 *
 * - Paleta de MARCA sobria (un índigo de transporte público).
 * - Colores SEMÁNTICOS de afluencia: verde = BAJA, ámbar = MEDIA, rojo = ALTA,
 *   usados de forma consistente en todos los indicadores.
 * - Soporte de modo claro y oscuro con buen contraste.
 */

export interface Theme {
  mode: 'light' | 'dark';
  brand: string;
  brandSoft: string;
  background: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  border: string;
  shadow: string;
  trackBg: string; // fondo de barras/anillos sin rellenar
}

export const lightTheme: Theme = {
  mode: 'light',
  brand: '#4F46E5',
  brandSoft: '#EEF0FE',
  background: '#F4F6FB',
  card: '#FFFFFF',
  cardAlt: '#F8F9FE',
  text: '#171A2B',
  textMuted: '#6B6F86',
  border: '#E7E9F2',
  shadow: '#1B1F3B',
  trackBg: '#EAECF4',
};

export const darkTheme: Theme = {
  mode: 'dark',
  brand: '#8B8BF5',
  brandSoft: '#23264A',
  background: '#0D0E18',
  card: '#181A29',
  cardAlt: '#1F2236',
  text: '#F3F4FB',
  textMuted: '#9A9EB8',
  border: '#272A40',
  shadow: '#000000',
  trackBg: '#262A40',
};

/** Metadatos visuales de cada nivel de ocupación (color, ícono, etiqueta). */
export interface NivelMeta {
  label: string;
  /** Nombre de ícono de @expo/vector-icons (Ionicons). */
  icon: 'checkmark-circle' | 'alert-circle' | 'warning';
  colorLight: string;
  colorDark: string;
  /** Tinte de fondo suave para badges. */
  tintLight: string;
  tintDark: string;
}

export const NIVEL_META: Record<NivelOcupacion, NivelMeta> = {
  [NivelOcupacion.BAJA]: {
    label: 'Baja',
    icon: 'checkmark-circle',
    colorLight: '#1F9D63',
    colorDark: '#3FD78A',
    tintLight: '#E4F6EC',
    tintDark: '#13301F',
  },
  [NivelOcupacion.MEDIA]: {
    label: 'Media',
    icon: 'alert-circle',
    colorLight: '#D98A0B',
    colorDark: '#F7B73D',
    tintLight: '#FCF1DC',
    tintDark: '#33270B',
  },
  [NivelOcupacion.ALTA]: {
    label: 'Alta',
    icon: 'warning',
    colorLight: '#D6383D',
    colorDark: '#FF6B6F',
    tintLight: '#FCE4E5',
    tintDark: '#34161A',
  },
};

/** Devuelve el color del nivel adecuado para el modo claro/oscuro. */
export function colorNivel(nivel: NivelOcupacion, theme: Theme): string {
  const meta = NIVEL_META[nivel];
  return theme.mode === 'dark' ? meta.colorDark : meta.colorLight;
}

/** Devuelve el tinte de fondo del nivel para el modo claro/oscuro. */
export function tintNivel(nivel: NivelOcupacion, theme: Theme): string {
  const meta = NIVEL_META[nivel];
  return theme.mode === 'dark' ? meta.tintDark : meta.tintLight;
}
