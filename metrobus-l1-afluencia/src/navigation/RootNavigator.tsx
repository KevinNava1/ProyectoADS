import { Ionicons } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MapScreen } from '../screens/MapScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StationDetailScreen } from '../screens/StationDetailScreen';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/** Barra de pestañas inferior con las tres secciones principales. */
function Tabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.brand,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          // Respeta el área segura (indicador de inicio) en cualquier teléfono.
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11.5, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const iconos: Record<keyof TabParamList, string> = {
            Inicio: focused ? 'home' : 'home-outline',
            Mapa: focused ? 'map' : 'map-outline',
            Ajustes: focused ? 'settings' : 'settings-outline',
          };
          return (
            <Ionicons
              name={iconos[route.name] as any}
              size={size - 2}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

/**
 * Navegador raíz: contiene las pestañas y, por encima, la pantalla de detalle
 * de estación (que se abre desde el mapa o el dashboard).
 */
export function RootNavigator() {
  const theme = useTheme();

  // Adaptamos el tema de react-navigation para que los fondos coincidan.
  const navTheme =
    theme.mode === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: theme.background,
            card: theme.card,
            text: theme.text,
            border: theme.border,
            primary: theme.brand,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: theme.background,
            card: theme.card,
            text: theme.text,
            border: theme.border,
            primary: theme.brand,
          },
        };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="DetalleEstacion"
          component={StationDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
