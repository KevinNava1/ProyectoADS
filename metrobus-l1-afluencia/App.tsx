import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingGate } from './src/components/OnboardingGate';
import { AppDataProvider } from './src/context/AppDataContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

/**
 * Punto de entrada de "Metrobús L1 – Afluencia".
 *
 * Envuelve la app con los proveedores de tema (claro/oscuro) y de datos
 * simulados, y monta el navegador raíz. La barra de estado se adapta al tema.
 */
function StatusBarAdaptativa() {
  const theme = useTheme();
  return <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppDataProvider>
            <OnboardingProvider>
              <StatusBarAdaptativa />
              <OnboardingGate>
                <RootNavigator />
              </OnboardingGate>
            </OnboardingProvider>
          </AppDataProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
