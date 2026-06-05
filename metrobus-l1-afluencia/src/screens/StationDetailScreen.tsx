import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAfluencia } from '../api/client';
import { USE_BACKEND } from '../config';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import { AfluenciaChart } from '../components/AfluenciaChart';
import { Card } from '../components/Card';
import { GradientCard } from '../components/GradientCard';
import { OccupancyBadge } from '../components/OccupancyBadge';
import { OccupancyGauge } from '../components/OccupancyGauge';
import { StationIcon } from '../components/StationIcon';
import { UpcomingList } from '../components/UpcomingList';
import { useAppData } from '../context/AppDataContext';
import { ESTACIONES_L1 } from '../data/estaciones';
import { perfilAfluenciaPorHora, PuntoAfluencia } from '../data/simulation';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel } from '../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleEstacion'>;

/**
 * Detalle de una estación: nivel actual del andén, gráfica de afluencia por
 * horario (horas pico) y los tiempos estimados de las próximas unidades.
 */
export function StationDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { estadoDe, ahora, estacionFavoritaId, setEstacionFavoritaId, refrescar } =
    useAppData();
  const [refreshing, setRefreshing] = useState(false);

  const estacion =
    ESTACIONES_L1.find((e) => e.id === route.params.estacionId) ??
    ESTACIONES_L1[0];
  const estado = estadoDe(estacion);
  const esFavorita = estacionFavoritaId === estacion.id;

  // Perfil de afluencia por horario: local por defecto; del backend si está activo.
  const [perfil, setPerfil] = useState<PuntoAfluencia[]>(() =>
    perfilAfluenciaPorHora(estacion),
  );
  useEffect(() => {
    if (!USE_BACKEND) {
      setPerfil(perfilAfluenciaPorHora(estacion));
      return;
    }
    let cancelado = false;
    fetchAfluencia(estacion.id)
      .then((p) => !cancelado && setPerfil(p))
      .catch(() => {
        if (!cancelado) setPerfil(perfilAfluenciaPorHora(estacion));
      });
    return () => {
      cancelado = true;
    };
  }, [estacion.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refrescar();
    if (USE_BACKEND) {
      try {
        setPerfil(await fetchAfluencia(estacion.id));
      } catch {
        /* respaldo: se conserva el perfil local */
      }
    }
    hapticSuccess();
    setRefreshing(false);
  }, [refrescar, estacion.id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      {/* Barra superior */}
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <View style={styles.navCenter}>
          <StationIcon
            estacionId={estacion.id}
            color={colorNivel(estado.nivelAnden, theme)}
            size={26}
          />
          <Text style={[styles.navTitle, { color: theme.text }]} numberOfLines={1}>
            {estacion.nombre}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            hapticLight();
            setEstacionFavoritaId(esFavorita ? null : estacion.id);
          }}
          hitSlop={10}
        >
          <Ionicons
            name={esFavorita ? 'star' : 'star-outline'}
            size={23}
            color={esFavorita ? theme.brand : theme.textMuted}
          />
        </Pressable>
      </View>

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
        <View style={styles.ubicRow}>
          <Ionicons name="location-outline" size={15} color={theme.textMuted} />
          <Text style={[styles.ubic, { color: theme.textMuted }]}>
            {estacion.ubicacion}
          </Text>
        </View>

        {/* Estado actual del andén */}
        <GradientCard nivel={estado.nivelAnden} contentStyle={styles.estadoCard}>
          <OccupancyGauge
            pct={estado.saturacionPct}
            nivel={estado.nivelAnden}
            sublabel="andén"
          />
          <View style={styles.estadoInfo}>
            <Text style={[styles.estadoLabel, { color: theme.textMuted }]}>
              Ocupación actual del andén
            </Text>
            <Text style={[styles.estadoPersonas, { color: theme.text }]}>
              ~{estado.personasEnEspera} personas
            </Text>
            <OccupancyBadge nivel={estado.nivelAnden} />
            <View style={[styles.miniRow]}>
              <Ionicons name="enter-outline" size={15} color={theme.textMuted} />
              <Text style={[styles.mini, { color: theme.textMuted }]}>
                {estado.metrica.totalEntradas} entradas /{' '}
                {estado.metrica.totalSalidas} salidas
              </Text>
            </View>
          </View>
        </GradientCard>

        {/* Gráfica de afluencia por horario */}
        <Card>
          <Text style={[styles.seccion, { color: theme.text }]}>
            Afluencia por horario
          </Text>
          <Text style={[styles.seccionSub, { color: theme.textMuted }]}>
            Día típico · la barra resaltada es la hora actual
          </Text>
          <AfluenciaChart puntos={perfil} horaActual={ahora.getHours()} />
        </Card>

        {/* Próximas unidades */}
        <UpcomingList unidades={estado.proximas.slice(0, 3)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  navCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navTitle: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 30,
  },
  ubicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ubic: {
    fontSize: 13.5,
    fontWeight: '500',
    flex: 1,
  },
  estadoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  estadoInfo: {
    flex: 1,
    gap: 6,
  },
  estadoLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  estadoPersonas: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  mini: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  seccion: {
    fontSize: 16,
    fontWeight: '800',
  },
  seccionSub: {
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 16,
  },
});
