import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel, tintNivel } from '../theme/palette';
import { NivelOcupacion } from '../types/models';

interface Props {
  /** Nivel que define el tinte del degradado y la barra de acento. */
  nivel: NivelOcupacion;
  children: React.ReactNode;
  /** Mostrar la barra lateral de acento (color del nivel). */
  accent?: boolean;
  padding?: number;
  /** Estilo del contenedor interno (p. ej. para layout en fila). */
  contentStyle?: ViewStyle | ViewStyle[];
  style?: ViewStyle | ViewStyle[];
}

/**
 * Tarjeta con degradado sutil teñido por el nivel de ocupación + barra de
 * acento lateral. Da una identidad visual consistente y "premium" a las
 * tarjetas clave (próxima unidad, andén, estado de estación).
 */
export function GradientCard({
  nivel,
  children,
  accent = true,
  padding = 18,
  contentStyle,
  style,
}: Props) {
  const theme = useTheme();
  const color = colorNivel(nivel, theme);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[theme.card, tintNivel(nivel, theme)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {accent && <View style={[styles.accent, { backgroundColor: color }]} />}
      <View
        style={[
          { padding, paddingLeft: accent ? padding + 2 : padding },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 4,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
});
