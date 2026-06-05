import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../theme/ThemeContext';
import {
  formatCuentaRegresiva,
  segundosRestantes,
} from '../utils/format';

interface Props {
  llegada: Date;
  /** Color de acento (normalmente el del nivel de ocupación de la unidad). */
  color: string;
}

/**
 * Cuenta regresiva grande para el tiempo estimado de llegada de una unidad.
 * Se sincroniza con el reloj global de 1 s del AppDataContext.
 */
export function Countdown({ llegada, color }: Props) {
  const theme = useTheme();
  const { ahora } = useAppData();
  const seg = segundosRestantes(llegada, ahora);
  const llegando = seg <= 20;

  return (
    <View style={styles.row}>
      {llegando ? (
        <Text style={[styles.llegando, { color }]}>Llegando</Text>
      ) : (
        <>
          <Text style={[styles.numero, { color: theme.text }]}>
            {formatCuentaRegresiva(seg)}
          </Text>
          <Text style={[styles.unidad, { color: theme.textMuted }]}>min</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  numero: {
    fontSize: 52,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  unidad: {
    fontSize: 16,
    fontWeight: '600',
  },
  llegando: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
