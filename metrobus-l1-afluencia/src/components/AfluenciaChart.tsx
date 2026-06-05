import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PuntoAfluencia } from '../data/simulation';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel } from '../theme/palette';

interface Props {
  puntos: PuntoAfluencia[];
  /** Hora actual (0–23) para resaltar la barra correspondiente. */
  horaActual: number;
}

/**
 * Gráfica de barras simple de afluencia por horario. Cada barra se colorea
 * según su nivel y la hora actual se resalta para que el usuario identifique
 * de un vistazo sus horas pico.
 */
export function AfluenciaChart({ puntos, horaActual }: Props) {
  const theme = useTheme();
  const maximo = Math.max(...puntos.map((p) => p.valor), 1);

  return (
    <View>
      <View style={styles.chart}>
        {puntos.map((p) => {
          const altura = 12 + (p.valor / maximo) * 108;
          const esAhora = p.hora === horaActual;
          const color = colorNivel(p.nivel, theme);
          return (
            <View key={p.hora} style={styles.col}>
              <View
                style={[
                  styles.bar,
                  {
                    height: altura,
                    backgroundColor: color,
                    opacity: esAhora ? 1 : 0.55,
                  },
                  esAhora && {
                    borderWidth: 2,
                    borderColor: theme.text,
                  },
                ]}
              />
              {p.hora % 3 === 0 && (
                <Text style={[styles.etiqueta, { color: theme.textMuted }]}>
                  {p.hora}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <Text style={[styles.eje, { color: theme.textMuted }]}>
        Hora del día (afluencia estimada)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    gap: 3,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: 5,
  },
  etiqueta: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  eje: {
    fontSize: 11.5,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});
