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
import { DirectionToggle } from '../components/DirectionToggle';
import { FadeInView } from '../components/FadeInView';
import { NextUnitCard } from '../components/NextUnitCard';
import { SkeletonCard } from '../components/Skeleton';
import { StationIcon } from '../components/StationIcon';
import { StationPickerModal } from '../components/StationPickerModal';
import { TrendIndicator } from '../components/TrendIndicator';
import { UpcomingList } from '../components/UpcomingList';
import { UpdatePill } from '../components/UpdatePill';
import { WaitingCard } from '../components/WaitingCard';
import { useAppData } from '../context/AppDataContext';
import { RootStackParamList } from '../navigation/types';
import { colorNivel } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';
import { hapticSelect, hapticSuccess } from '../utils/haptics';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * Pantalla principal (Dashboard). Concentra la decisión rápida del usuario:
 * selector de estación + próxima unidad (dominante) + andén + siguientes.
 */
export function DashboardScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const {
    estacionActual,
    estadoActual,
    setEstacionActualId,
    estacionFavoritaId,
    direccion,
    setDireccion,
    tendencia,
    sugerencia,
    cargando,
    refrescar,
  } = useAppData();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const proxima = estadoActual.proximas[0];
  const siguientes = estadoActual.proximas.slice(1, 4);
  const esFavorita = estacionFavoritaId === estacionActual.id;

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
        {/* Encabezado */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.brandRow}>
              <View style={styles.lineBadge}>
                <Text style={styles.lineBadgeTxt}>1</Text>
              </View>
              <Text style={[styles.hola, { color: theme.textMuted }]}>
                Metrobús · Línea 1
              </Text>
            </View>
            <Text style={[styles.appTitle, { color: theme.text }]}>
              Afluencia en tiempo real
            </Text>
          </View>
          <UpdatePill />
        </View>

        <ConnectionBanner />

        {/* Selector de estación */}
        <Pressable
          onPress={() => {
            hapticSelect();
            setPickerVisible(true);
          }}
          style={({ pressed }) => [
            styles.selector,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <StationIcon
            estacionId={estacionActual.id}
            color={colorNivel(estadoActual.nivelAnden, theme)}
            size={40}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.selectorLabel, { color: theme.textMuted }]}>
              Tu estación
            </Text>
            <View style={styles.selectorNombreRow}>
              <Text style={[styles.selectorNombre, { color: theme.text }]} numberOfLines={1}>
                {estacionActual.nombre}
              </Text>
              {esFavorita && (
                <Ionicons name="star" size={14} color={theme.brand} />
              )}
            </View>
          </View>
          <Ionicons name="swap-vertical" size={20} color={theme.textMuted} />
        </Pressable>

        {/* Dirección + tendencia */}
        <View style={styles.controlRow}>
          <View style={{ flex: 1 }}>
            <DirectionToggle direccion={direccion} onChange={setDireccion} />
          </View>
          <View style={[styles.trendChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TrendIndicator tendencia={tendencia} />
          </View>
        </View>

        {/* Sugerencia de mejor horario (si aplica) */}
        {sugerencia && (
          <View style={[styles.sugerencia, { backgroundColor: theme.brandSoft }]}>
            <Ionicons name="bulb" size={15} color={theme.brand} />
            <Text style={[styles.sugerenciaTxt, { color: theme.brand }]}>
              {sugerencia}
            </Text>
          </View>
        )}

        {/* Tarjeta dominante: próxima unidad */}
        {cargando ? (
          <SkeletonCard />
        ) : (
          proxima && (
            <FadeInView delay={40}>
              <NextUnitCard proxima={proxima} />
            </FadeInView>
          )
        )}

        {/* Andén */}
        {!cargando && (
          <FadeInView delay={120}>
            <WaitingCard estado={estadoActual} />
          </FadeInView>
        )}

        {/* Siguientes unidades */}
        {!cargando && siguientes.length > 0 && (
          <FadeInView delay={200}>
            <UpcomingList unidades={siguientes} />
          </FadeInView>
        )}

        {/* Acceso al detalle */}
        <Pressable
          onPress={() =>
            navigation.navigate('DetalleEstacion', {
              estacionId: estacionActual.id,
            })
          }
          style={({ pressed }) => [
            styles.detalleBtn,
            { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="bar-chart" size={17} color={theme.brand} />
          <Text style={[styles.detalleTxt, { color: theme.brand }]}>
            Ver afluencia por horario
          </Text>
          <Ionicons name="chevron-forward" size={17} color={theme.brand} />
        </Pressable>

        <Text style={[styles.nota, { color: theme.textMuted }]}>
          Datos simulados con fines académicos. Información agregada y anonimizada;
          se recalcula cada 60 s. Desliza hacia abajo para actualizar.
        </Text>
      </ScrollView>

      <StationPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={(e) => setEstacionActualId(e.id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 30,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 3,
  },
  lineBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: '#D11F2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineBadgeTxt: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },
  hola: {
    fontSize: 13,
    fontWeight: '600',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 2,
    maxWidth: 220,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectorNombreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectorNombre: {
    fontSize: 18,
    fontWeight: '800',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  trendChip: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sugerencia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 12,
  },
  sugerenciaTxt: {
    fontSize: 13,
    fontWeight: '700',
  },
  detalleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  detalleTxt: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  nota: {
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 10,
  },
});
