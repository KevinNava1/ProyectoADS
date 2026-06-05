import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * Contenedor base de tarjeta: esquinas redondeadas, sombra sutil y color de
 * superficie según el tema. Da consistencia visual a toda la app.
 */
export function Card({
  style,
  children,
  ...rest
}: ViewProps & { style?: ViewStyle | ViewStyle[] }) {
  const theme = useTheme();
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
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
});
