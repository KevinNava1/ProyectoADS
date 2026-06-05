import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tendencia } from '../data/simulation';
import { useTheme } from '../theme/ThemeContext';

const META: Record<
  Tendencia,
  { icon: 'trending-up' | 'trending-down' | 'remove'; label: string }
> = {
  subiendo: { icon: 'trending-up', label: 'En aumento' },
  bajando: { icon: 'trending-down', label: 'Bajando' },
  estable: { icon: 'remove', label: 'Estable' },
};

/** Indicador de tendencia de afluencia (↑ subiendo / ↓ bajando / – estable). */
export function TrendIndicator({ tendencia }: { tendencia: Tendencia }) {
  const theme = useTheme();
  const meta = META[tendencia];
  // Verde si baja (mejor), rojo si sube (peor), neutro si estable.
  const color =
    tendencia === 'bajando'
      ? '#1F9D63'
      : tendencia === 'subiendo'
        ? '#D6383D'
        : theme.textMuted;

  return (
    <View style={styles.row}>
      <Ionicons name={meta.icon} size={15} color={color} />
      <Text style={[styles.txt, { color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  txt: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
