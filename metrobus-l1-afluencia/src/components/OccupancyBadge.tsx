import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel, NIVEL_META, tintNivel } from '../theme/palette';
import { NivelOcupacion } from '../types/models';

interface Props {
  nivel: NivelOcupacion;
  size?: 'sm' | 'md';
  /** Texto opcional que reemplaza la etiqueta por defecto (Baja/Media/Alta). */
  texto?: string;
}

/**
 * Insignia de nivel de ocupación. Para accesibilidad NO depende solo del
 * color: siempre muestra un ícono con forma distinta + etiqueta de texto.
 */
export function OccupancyBadge({ nivel, size = 'md', texto }: Props) {
  const theme = useTheme();
  const meta = NIVEL_META[nivel];
  const color = colorNivel(nivel, theme);
  const small = size === 'sm';

  return (
    <View
      accessibilityLabel={`Ocupación ${meta.label}`}
      style={[
        styles.badge,
        {
          backgroundColor: tintNivel(nivel, theme),
          paddingVertical: small ? 4 : 6,
          paddingHorizontal: small ? 8 : 11,
        },
      ]}
    >
      <Ionicons name={meta.icon} size={small ? 13 : 16} color={color} />
      <Text
        style={[
          styles.label,
          { color, fontSize: small ? 12 : 13.5 },
        ]}
      >
        {texto ?? meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '700',
  },
});
