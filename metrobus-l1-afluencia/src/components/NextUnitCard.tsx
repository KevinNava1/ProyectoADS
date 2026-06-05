import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel } from '../theme/palette';
import { UnidadProxima } from '../types/models';
import { formatHora } from '../utils/format';
import { Countdown } from './Countdown';
import { GradientCard } from './GradientCard';
import { OccupancyBadge } from './OccupancyBadge';
import { OccupancyGauge } from './OccupancyGauge';

/**
 * Tarjeta principal (la que domina el Dashboard): muestra la PRÓXIMA unidad
 * con su cuenta regresiva grande y un anillo de ocupación.
 */
export function NextUnitCard({ proxima }: { proxima: UnidadProxima }) {
  const theme = useTheme();
  const color = colorNivel(proxima.nivel, theme);

  return (
    <GradientCard nivel={proxima.nivel} padding={20}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.busDot, { backgroundColor: color }]}>
            <Ionicons name="bus" size={15} color="#fff" />
          </View>
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            Próxima unidad
          </Text>
        </View>
        <OccupancyBadge nivel={proxima.nivel} />
      </View>

      <View style={styles.body}>
        <View style={styles.left}>
          <Text style={[styles.subtitulo, { color: theme.textMuted }]}>
            Llega en
          </Text>
          <Countdown llegada={proxima.llegada} color={color} />
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={theme.textMuted} />
            <Text style={[styles.meta, { color: theme.textMuted }]}>
              {formatHora(proxima.llegada)} h · {proxima.unidad.id}
            </Text>
          </View>
        </View>

        <OccupancyGauge pct={proxima.ocupacionPct} nivel={proxima.nivel} />
      </View>
    </GradientCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  busDot: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flex: 1,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
  },
});
