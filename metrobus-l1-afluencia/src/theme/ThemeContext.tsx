import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from './palette';

/** Preferencia de tema elegida por el usuario en Ajustes. */
export type PreferenciaTema = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  preferencia: PreferenciaTema;
  setPreferencia: (p: PreferenciaTema) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Proveedor de tema. Resuelve la preferencia del usuario contra el esquema
 * del sistema (claro/oscuro) y entrega el objeto Theme correspondiente.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const esquemaSistema = useColorScheme(); // 'light' | 'dark' | null
  const [preferencia, setPreferencia] = useState<PreferenciaTema>('system');

  const value = useMemo<ThemeContextValue>(() => {
    const modo =
      preferencia === 'system' ? esquemaSistema ?? 'light' : preferencia;
    return {
      theme: modo === 'dark' ? darkTheme : lightTheme,
      preferencia,
      setPreferencia,
    };
  }, [preferencia, esquemaSistema]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Hook para consumir el tema activo. */
export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx.theme;
}

/** Hook para leer/cambiar la preferencia de tema (usado en Ajustes). */
export function useThemePreference() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error('useThemePreference debe usarse dentro de ThemeProvider');
  return {
    preferencia: ctx.preferencia,
    setPreferencia: ctx.setPreferencia,
  };
}
