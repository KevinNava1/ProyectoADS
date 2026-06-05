import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel, NIVEL_META } from '../theme/palette';
import { Estacion, NivelOcupacion } from '../types/models';
import { hapticSelect } from '../utils/haptics';
import { StationIcon } from './StationIcon';

/* Geometría de la tira (estilo "mapa de metro" horizontal). */
const COL = 60; // ancho de cada estación
const CALLOUT_SLOT = 50; // espacio reservado arriba para el globo de la activa
const NODE_SLOT = 48; // fila donde vive el mosaico + la línea troncal
const LABEL_SLOT = 132; // alto del área de nombres (en vertical)
const LABEL_LEN = 116; // longitud máxima del nombre (vertical)
const NODE = 30; // lado del mosaico (pictograma)
// Empuja el texto rotado para que quede DEBAJO del nodo (sin encimarse).
const LABEL_MARGIN_TOP = 8 + LABEL_LEN / 2 - 7;
const LINE_COLOR = '#D11F2A'; // rojo institucional de la Línea 1
const LINE_Y = CALLOUT_SLOT + NODE_SLOT / 2 - 2; // y de la línea troncal

interface ColumnProps {
  estacion: Estacion;
  activa: boolean;
  color: string;
  nivel: NivelOcupacion;
  espera: number;
  onPress: () => void;
}

/** Una estación de la tira: nodo en la línea + nombre vertical + globo si está activa. */
function StationColumn({
  estacion,
  activa,
  color,
  nivel,
  espera,
  onPress,
}: ColumnProps) {
  const theme = useTheme();
  const anim = useRef(new Animated.Value(activa ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: activa ? 1 : 0,
      friction: 6,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [activa, anim]);

  const nodeScale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const calloutTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <Pressable onPress={onPress} style={{ width: COL }} hitSlop={4}>
      {/* Globo (callout) de la estación activa */}
      <View style={styles.calloutSlot}>
        {activa && (
          <Animated.View
            style={[
              styles.callout,
              {
                backgroundColor: theme.card,
                borderColor: color,
                opacity: anim,
                transform: [{ translateY: calloutTranslate }],
              },
            ]}
          >
            <Ionicons name={NIVEL_META[nivel].icon} size={12} color={color} />
            <Text style={[styles.calloutTxt, { color: theme.text }]}>
              ~{espera}
            </Text>
            <View style={[styles.calloutArrow, { borderTopColor: color }]} />
          </Animated.View>
        )}
      </View>

      {/* Mosaico con el pictograma oficial, sobre la línea troncal */}
      <View style={styles.nodeSlot}>
        {activa && (
          <View style={[styles.halo, { backgroundColor: color }]} />
        )}
        <Animated.View style={{ transform: [{ scale: nodeScale }] }}>
          <StationIcon
            estacionId={estacion.id}
            color={color}
            size={NODE}
            borderColor={theme.card}
            borderWidth={2.5}
          />
        </Animated.View>
      </View>

      {/* Nombre en vertical (como el mapa oficial) */}
      <View style={styles.labelSlot}>
        <View style={styles.labelRot}>
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              {
                color: activa ? theme.text : theme.textMuted,
                fontWeight: activa ? '800' : '600',
              },
            ]}
          >
            {estacion.nombre}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Mapa esquemático HORIZONTAL de la Línea 1 (estilo mapa de Metrobús): una
 * línea roja con todas las estaciones como nodos codificados por color de
 * afluencia. Al tocar una estación se selecciona (se vuelve la estación actual),
 * el mapa se desplaza para centrarla y aparece un globo con su afluencia.
 */
export function LineStripMap({
  onSelect,
}: {
  onSelect?: (estacion: Estacion) => void;
}) {
  const theme = useTheme();
  const { estaciones, estadoDe, estacionActual, setEstacionActualId } =
    useAppData();
  const scrollRef = useRef<ScrollView>(null);
  const screenW = Dimensions.get('window').width;

  const activeIndex = estaciones.findIndex((e) => e.id === estacionActual.id);
  const contentWidth = estaciones.length * COL;

  // Centra automáticamente la estación seleccionada.
  useEffect(() => {
    const x = Math.max(
      0,
      Math.min(activeIndex * COL + COL / 2 - screenW / 2, contentWidth - screenW),
    );
    const t = setTimeout(
      () => scrollRef.current?.scrollTo({ x, animated: true }),
      80,
    );
    return () => clearTimeout(t);
  }, [activeIndex, contentWidth, screenW]);

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow },
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
      >
        <View style={{ width: contentWidth }}>
          {/* Línea troncal roja por detrás de los nodos */}
          <View
            style={[
              styles.track,
              { top: LINE_Y, left: COL / 2, width: contentWidth - COL },
            ]}
          />
          {/* Topes de inicio/fin de línea */}
          <View style={[styles.cap, { top: LINE_Y - 4, left: COL / 2 - 5 }]} />
          <View
            style={[styles.cap, { top: LINE_Y - 4, left: contentWidth - COL / 2 - 5 }]}
          />

          <View style={styles.row}>
            {estaciones.map((e) => {
              const estado = estadoDe(e);
              return (
                <StationColumn
                  key={e.id}
                  estacion={e}
                  activa={e.id === estacionActual.id}
                  color={colorNivel(estado.nivelAnden, theme)}
                  nivel={estado.nivelAnden}
                  espera={estado.personasEnEspera}
                  onPress={() => {
                    hapticSelect();
                    setEstacionActualId(e.id);
                    onSelect?.(e);
                  }}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  track: {
    position: 'absolute',
    height: 5,
    borderRadius: 3,
    backgroundColor: LINE_COLOR,
  },
  cap: {
    position: 'absolute',
    width: 10,
    height: 13,
    borderRadius: 3,
    backgroundColor: LINE_COLOR,
  },
  calloutSlot: {
    height: CALLOUT_SLOT,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  calloutTxt: {
    fontSize: 12,
    fontWeight: '800',
  },
  calloutArrow: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  nodeSlot: {
    height: NODE_SLOT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: NODE + 18,
    height: NODE + 18,
    borderRadius: (NODE + 18) / 2,
    opacity: 0.18,
  },
  labelSlot: {
    height: LABEL_SLOT,
    alignItems: 'center',
  },
  labelRot: {
    transform: [{ rotate: '-90deg' }],
    marginTop: LABEL_MARGIN_TOP,
  },
  label: {
    width: LABEL_LEN,
    textAlign: 'right', // los nombres "cuelgan" desde el nodo hacia abajo
    fontSize: 10.5,
    letterSpacing: 0.1,
  },
});
