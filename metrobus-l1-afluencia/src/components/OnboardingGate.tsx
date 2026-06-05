import React from 'react';
import { View } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { useTheme } from '../theme/ThemeContext';

/**
 * Muestra la bienvenida (onboarding) cuando corresponde: la primera vez o
 * cuando el usuario la relanza desde Ajustes. La lógica de persistencia vive
 * en OnboardingContext.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { mostrar, listo, completar } = useOnboarding();

  // Mientras se consulta el almacenamiento, fondo del tema (sin parpadeo).
  if (!listo) {
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  if (mostrar) {
    return <OnboardingScreen onDone={completar} />;
  }

  return <>{children}</>;
}
