import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const CLAVE = 'onboarding_visto_v1';

interface OnboardingValue {
  /** Si debe mostrarse la bienvenida ahora mismo. */
  mostrar: boolean;
  /** Ya se consultó el almacenamiento (evita parpadeo inicial). */
  listo: boolean;
  /** Vuelve a abrir el tutorial (desde Ajustes). */
  verTutorial: () => void;
  /** Marca el tutorial como visto y lo cierra. */
  completar: () => void;
}

const OnboardingContext = createContext<OnboardingValue | undefined>(undefined);

/**
 * Controla la visibilidad del onboarding. Lo muestra la primera vez (según
 * AsyncStorage) y permite relanzarlo manualmente desde Ajustes.
 */
export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [mostrar, setMostrar] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((v) => {
        if (v !== '1') setMostrar(true);
        setListo(true);
      })
      .catch(() => setListo(true));
  }, []);

  const verTutorial = () => setMostrar(true);
  const completar = () => {
    AsyncStorage.setItem(CLAVE, '1').catch(() => {});
    setMostrar(false);
  };

  return (
    <OnboardingContext.Provider value={{ mostrar, listo, verTutorial, completar }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error('useOnboarding debe usarse dentro de OnboardingProvider');
  return ctx;
}
