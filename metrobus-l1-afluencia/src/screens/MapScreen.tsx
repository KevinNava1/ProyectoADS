import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConnectionBanner } from '../components/ConnectionBanner';
import { LineStripMap } from '../components/LineStripMap';
import { NextUnitCard } from '../components/NextUnitCard';
import { UpdatePill } from '../components/UpdatePill';
import { WaitingCard } from '../components/WaitingCard';
import { hapticSuccess } from '../utils/haptics';
import { useAppData } from '../context/AppDataContext';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel, NIVEL_META } from '../theme/palette';
import { NivelOcupacion } from '../types/models';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Leyenda de colores (no depende solo del color: lleva ícono + etiqueta). */
function Leyenda() {
  const theme = useTheme();
  const niveles = [
    NivelOcupacion.BAJA,
    NivelOcupacion.MEDIA,
    NivelOcupacion.ALTA,
  ];
  return (
    <View style={styles.leyenda}>
      {niveles.map((n) => (
        <View key={n} style={styles.leyendaItem}>
          <View
            style={[styles.leyendaDot, { backgroundColor: colorNivel(n, theme) }]}
          />
          <Text style={[styles.leyendaTxt, { color: theme.textMuted }]}>
            {NIVEL_META[n].label}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Pantalla del mapa de la Línea 1: tira horizontal interactiva (estilo mapa de
 * Metrobús) + detalle en vivo de la estación seleccionada.
 */
export function MapScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { estacionActual, estadoActual, refrescar } = useAppData();
  const proxima = estadoActual.proximas[0];
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refrescar();
    hapticSuccess();
    setRefreshing(false);
  }, [refrescar]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.brand}
            colors={[theme.brand]}
          />
        }
      >
        <ConnectionBanner />
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
              Mapa de la línea
            </Text>
            <View style={styles.titleRow}>
              <View style={[styles.lineBadge, { backgroundColor: '#D11F2A' }]}>
                <Text style={styles.lineBadgeTxt}>1</Text>
              </View>
              <Text style={[styles.title, { color: theme.text }]}>
                Metrobús · Línea 1
              </Text>
            </View>
          </View>
          <UpdatePill />
        </View>

        <Leyenda />

        {/* Tira interactiva: tocar una estación la selecciona */}
        <LineStripMap />

        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Desliza el mapa y toca una estación para verla aquí abajo.
        </Text>

        {/* Estación seleccionada en vivo */}
        <Pressable
          onPress={() =>
            navigation.navigate('DetalleEstacion', {
              estacionId: estacionActual.id,
            })
          }
          style={({ pressed }) => [styles.selTitleRow, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="location" size={18} color={theme.brand} />
          <Text style={[styles.selTitle, { color: theme.text }]} numberOfLines={1}>
            {estacionActual.nombre}
          </Text>
          <Text style={[styles.verDetalle, { color: theme.brand }]}>
            Ver detalle
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.brand} />
        </Pressable>

        {proxima && <NextUnitCard proxima={proxima} />}
        <WaitingCard estado={estadoActual} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 30,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  lineBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineBadgeTxt: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  leyenda: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leyendaDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  leyendaTxt: {
    fontSize: 13,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12.5,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: -4,
  },
  selTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  selTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
  },
  verDetalle: {
    fontSize: 14,
    fontWeight: '700',
  },
});
