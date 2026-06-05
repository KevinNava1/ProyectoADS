import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel } from '../theme/palette';
import { EstadoEstacion } from '../types/models';
import { GradientCard } from './GradientCard';
import { OccupancyBadge } from './OccupancyBadge';
import { SegmentedBar } from './SegmentedBar';

/**
 * Tarjeta secundaria: personas aproximadas esperando en el andén, con una
 * barra visual que indica qué tan lleno está respecto a su capacidad.
 */
export function WaitingCard({ estado }: { estado: EstadoEstacion }) {
  const theme = useTheme();
  const color = colorNivel(estado.nivelAnden, theme);

  return (
    <GradientCard nivel={estado.nivelAnden}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="people" size={18} color={theme.brand} />
          <Text style={[styles.title, { color: theme.textMuted }]}>
            Personas en el andén
          </Text>
        </View>
        <OccupancyBadge nivel={estado.nivelAnden} size="sm" />
      </View>

      <View style={styles.numbers}>
        <Text style={[styles.big, { color: theme.text }]}>
          ~{estado.personasEnEspera}
        </Text>
        <Text style={[styles.cap, { color: theme.textMuted }]}>
          / {estado.estacion.capacidadAnden} cap.
        </Text>
      </View>

      <SegmentedBar pct={estado.saturacionPct} color={color} />
      <Text style={[styles.hint, { color: theme.textMuted }]}>
        {estado.saturacionPct}% de la capacidad del andén
      </Text>
    </GradientCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  numbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  big: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  cap: {
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 8,
  },
});
