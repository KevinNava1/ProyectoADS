import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel } from '../theme/palette';
import { UnidadProxima } from '../types/models';
import { formatHora, segundosRestantes, textoLlegada } from '../utils/format';
import { Card } from './Card';
import { OccupancyBadge } from './OccupancyBadge';

/**
 * Lista de las siguientes unidades (después de la próxima) con su hora
 * estimada y su nivel de ocupación, para planear si conviene esperar otra.
 */
export function UpcomingList({ unidades }: { unidades: UnidadProxima[] }) {
  const theme = useTheme();
  const { ahora } = useAppData();

  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: theme.textMuted }]}>
        Siguientes unidades
      </Text>
      {unidades.map((u, i) => {
        const color = colorNivel(u.nivel, theme);
        const seg = segundosRestantes(u.llegada, ahora);
        return (
          <View
            key={u.unidad.id + i}
            style={[
              styles.row,
              i < unidades.length - 1 && {
                borderBottomColor: theme.border,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: color }]}>
              <Ionicons name="bus" size={15} color="#fff" />
            </View>
            <View style={styles.info}>
              <Text style={[styles.tiempo, { color: theme.text }]}>
                {textoLlegada(seg)}
              </Text>
              <Text style={[styles.hora, { color: theme.textMuted }]}>
                {formatHora(u.llegada)} h · {u.unidad.id}
              </Text>
            </View>
            <OccupancyBadge nivel={u.nivel} size="sm" />
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  tiempo: {
    fontSize: 16,
    fontWeight: '700',
  },
  hora: {
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 1,
  },
});
