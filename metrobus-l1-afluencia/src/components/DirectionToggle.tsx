import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Direccion } from '../data/simulation';
import { useTheme } from '../theme/ThemeContext';
import { hapticSelect } from '../utils/haptics';

const OPCIONES: { valor: Direccion; label: string; icon: 'arrow-up' | 'arrow-down' }[] = [
  { valor: 'norte', label: 'Indios Verdes', icon: 'arrow-up' },
  { valor: 'sur', label: 'El Caminero', icon: 'arrow-down' },
];

/** Selector segmentado de dirección del recorrido (Norte / Sur). */
export function DirectionToggle({
  direccion,
  onChange,
}: {
  direccion: Direccion;
  onChange: (d: Direccion) => void;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
      {OPCIONES.map((op) => {
        const activa = direccion === op.valor;
        return (
          <Pressable
            key={op.valor}
            onPress={() => {
              hapticSelect();
              onChange(op.valor);
            }}
            style={[
              styles.seg,
              activa && { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name={op.icon}
              size={14}
              color={activa ? theme.brand : theme.textMuted}
            />
            <Text
              style={[
                styles.txt,
                { color: activa ? theme.text : theme.textMuted },
              ]}
              numberOfLines={1}
            >
              {op.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 3,
  },
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  txt: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
