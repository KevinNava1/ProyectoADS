import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../theme/ThemeContext';
import { formatHace } from '../utils/format';

/**
 * Píldora que indica cuándo se actualizaron por última vez los datos. Da una
 * pequeña pulsación cada vez que llega un nuevo lote (cada 60 s), reforzando la
 * sensación de "información viva".
 */
export function UpdatePill() {
  const theme = useTheme();
  const { ahora, ultimaActualizacion } = useAppData();
  const escala = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(escala, { toValue: 1.12, duration: 180, useNativeDriver: true }),
      Animated.spring(escala, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [ultimaActualizacion, escala]);

  return (
    <Animated.View
      style={[
        styles.pill,
        { backgroundColor: theme.brandSoft, transform: [{ scale: escala }] },
      ]}
    >
      <Ionicons name="sync" size={13} color={theme.brand} />
      <Text style={[styles.txt, { color: theme.brand }]}>
        Actualizado {formatHace(ultimaActualizacion, ahora)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  txt: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
