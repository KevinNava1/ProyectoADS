import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { iconoEstacion } from '../data/estacionIconos';

interface Props {
  estacionId: string;
  /** Color de fondo del mosaico (normalmente el color de afluencia). */
  color: string;
  size?: number;
  /** Color del pictograma (por defecto blanco, como el mapa oficial). */
  iconColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Mosaico de una estación: el pictograma OFICIAL (silueta) centrado sobre un
 * cuadro de color. Reutilizado en el mapa, el dashboard y el detalle para dar
 * una identidad visual consistente a cada estación.
 */
export function StationIcon({
  estacionId,
  color,
  size = 32,
  iconColor = '#fff',
  borderColor,
  borderWidth = 0,
}: Props) {
  const src = iconoEstacion(estacionId);
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size * 0.3,
          backgroundColor: color,
          borderColor: borderColor ?? 'transparent',
          borderWidth,
        },
      ]}
    >
      {src && (
        <Image
          source={src}
          style={{
            width: size * 0.68,
            height: size * 0.68,
            tintColor: iconColor,
          }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
