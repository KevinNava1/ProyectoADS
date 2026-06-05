import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  /** Valor 0–100. */
  pct: number;
  color: string;
  height?: number;
}

/**
 * Barra de progreso animada con esquinas redondeadas. Se usa para representar
 * visualmente la saturación del andén (personas esperando vs. capacidad).
 */
export function SegmentedBar({ pct, color, height = 12 }: Props) {
  const theme = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const clamped = Math.max(0, Math.min(100, pct));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: clamped,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [clamped, anim]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[styles.track, { backgroundColor: theme.trackBg, height, borderRadius: height }]}
    >
      <Animated.View
        style={{ width, height, backgroundColor: color, borderRadius: height }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
});
