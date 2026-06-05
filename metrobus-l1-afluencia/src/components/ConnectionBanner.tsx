import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../theme/ThemeContext';

/**
 * Banner que avisa cuando no se pudo contactar el backend y la app está usando
 * la simulación local de respaldo. Solo aparece en modo backend con error.
 */
export function ConnectionBanner() {
  const theme = useTheme();
  const { errorBackend } = useAppData();
  if (!errorBackend) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.mode === 'dark' ? '#34270B' : '#FCF1DC' }]}>
      <Ionicons name="cloud-offline-outline" size={16} color="#D98A0B" />
      <Text style={[styles.txt, { color: theme.text }]}>
        Sin conexión al servidor · mostrando datos locales
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  txt: {
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },
});
