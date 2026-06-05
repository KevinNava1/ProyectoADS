import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/** Bloque "esqueleto" con animación de brillo (shimmer) mientras cargan datos. */
export function Skeleton({
  width,
  height,
  radius = 10,
  style,
}: {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: any;
}) {
  const theme = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View
      style={[
        {
          width: width ?? '100%',
          height,
          borderRadius: radius,
          backgroundColor: theme.trackBg,
          opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
        },
        style,
      ]}
    />
  );
}

/** Esqueleto con la forma de una tarjeta de afluencia (para la carga inicial). */
export function SkeletonCard() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.row}>
        <Skeleton width="55%" height={14} />
        <Skeleton width={64} height={24} radius={999} />
      </View>
      <View style={styles.body}>
        <View style={{ flex: 1, gap: 10 }}>
          <Skeleton width="40%" height={12} />
          <Skeleton width="70%" height={40} />
          <Skeleton width="55%" height={12} />
        </View>
        <Skeleton width={120} height={120} radius={60} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
