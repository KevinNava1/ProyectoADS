import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel, NIVEL_META } from '../theme/palette';
import { NivelOcupacion } from '../types/models';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  /** Porcentaje 0–100. */
  pct: number;
  nivel: NivelOcupacion;
  size?: number;
  /** Texto secundario bajo el porcentaje (p. ej. "ocupación"). */
  sublabel?: string;
}

/**
 * Indicador tipo anillo (gauge) que muestra un porcentaje de ocupación.
 * El arco se colorea según el nivel semántico y se anima suavemente al
 * actualizarse (microinteracción). El número central comunica la cifra exacta.
 */
export function OccupancyGauge({
  pct,
  nivel,
  size = 132,
  sublabel = 'ocupación',
}: Props) {
  const theme = useTheme();
  const color = colorNivel(nivel, theme);

  const stroke = Math.max(10, size * 0.1);
  const radio = (size - stroke) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const clamped = Math.max(0, Math.min(100, pct));

  // Animación del relleno del anillo al cambiar el porcentaje.
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: clamped / 100,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [clamped, anim]);

  const strokeDashoffset = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [circunferencia, 0],
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Giramos -90° para que el arco empiece arriba. */}
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radio}
            stroke={theme.trackBg}
            strokeWidth={stroke}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radio}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circunferencia} ${circunferencia}`}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>

      {/* Contenido centrado encima del SVG. */}
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.pct, { color: theme.text, fontSize: size * 0.26 }]}>
          {Math.round(clamped)}
          <Text style={{ fontSize: size * 0.14, color: theme.textMuted }}>%</Text>
        </Text>
        <Text style={[styles.sub, { color }]}>{NIVEL_META[nivel].label}</Text>
        <Text style={[styles.sublabel, { color: theme.textMuted }]}>
          {sublabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pct: {
    fontWeight: '800',
    lineHeight: undefined,
  },
  sub: {
    fontWeight: '800',
    fontSize: 13,
    marginTop: -2,
  },
  sublabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
