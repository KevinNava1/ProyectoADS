import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { StationPickerModal } from '../components/StationPickerModal';
import { useAppData } from '../context/AppDataContext';
import { useOnboarding } from '../context/OnboardingContext';
import { ESTACIONES_L1 } from '../data/estaciones';
import { hapticLight } from '../utils/haptics';
import { PreferenciaTema, useThemePreference } from '../theme/ThemeContext';
import { useTheme } from '../theme/ThemeContext';

const OPCIONES_TEMA: { valor: PreferenciaTema; label: string; icon: any }[] = [
  { valor: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
  { valor: 'light', label: 'Claro', icon: 'sunny-outline' },
  { valor: 'dark', label: 'Oscuro', icon: 'moon-outline' },
];

/** Pantalla de preferencias: estación favorita y apariencia (claro/oscuro). */
export function SettingsScreen() {
  const theme = useTheme();
  const { preferencia, setPreferencia } = useThemePreference();
  const { estacionFavoritaId, setEstacionFavoritaId, setEstacionActualId, modoDatos } =
    useAppData();
  const { verTutorial } = useOnboarding();
  const [pickerVisible, setPickerVisible] = useState(false);

  const favorita = ESTACIONES_L1.find((e) => e.id === estacionFavoritaId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Ajustes</Text>

        {/* Estación favorita */}
        <Text style={[styles.label, { color: theme.textMuted }]}>
          Estación favorita
        </Text>
        <Card style={styles.cardRow}>
          <Pressable
            style={styles.favRow}
            onPress={() => setPickerVisible(true)}
          >
            <Ionicons name="star" size={20} color={theme.brand} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.favNombre, { color: theme.text }]}>
                {favorita ? favorita.nombre : 'Sin estación favorita'}
              </Text>
              <Text style={[styles.favHint, { color: theme.textMuted }]}>
                {favorita
                  ? 'Toca para cambiarla'
                  : 'Elige una para acceder rápido'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </Pressable>
          {favorita && (
            <Pressable
              onPress={() => setEstacionFavoritaId(null)}
              style={[styles.quitar, { borderTopColor: theme.border }]}
            >
              <Text style={[styles.quitarTxt, { color: theme.textMuted }]}>
                Quitar favorita
              </Text>
            </Pressable>
          )}
        </Card>

        {/* Apariencia */}
        <Text style={[styles.label, { color: theme.textMuted }]}>
          Apariencia
        </Text>
        <Card style={{ gap: 8 }}>
          {OPCIONES_TEMA.map((op) => {
            const activa = preferencia === op.valor;
            return (
              <Pressable
                key={op.valor}
                onPress={() => setPreferencia(op.valor)}
                style={[
                  styles.temaRow,
                  activa && { backgroundColor: theme.brandSoft },
                ]}
              >
                <Ionicons
                  name={op.icon}
                  size={20}
                  color={activa ? theme.brand : theme.textMuted}
                />
                <Text
                  style={[
                    styles.temaTxt,
                    { color: activa ? theme.brand : theme.text },
                  ]}
                >
                  {op.label}
                </Text>
                {activa && (
                  <Ionicons name="checkmark-circle" size={20} color={theme.brand} />
                )}
              </Pressable>
            );
          })}
        </Card>

        {/* Ayuda */}
        <Text style={[styles.label, { color: theme.textMuted }]}>Ayuda</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Pressable
            onPress={() => {
              hapticLight();
              verTutorial();
            }}
            style={({ pressed }) => [styles.favRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="play-circle-outline" size={20} color={theme.brand} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.favNombre, { color: theme.text }]}>
                Ver tutorial de bienvenida
              </Text>
              <Text style={[styles.favHint, { color: theme.textMuted }]}>
                Repasa cómo usar la app
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </Pressable>
        </Card>

        {/* Acerca de */}
        <Text style={[styles.label, { color: theme.textMuted }]}>Acerca de</Text>
        <Card>
          <Text style={[styles.acercaTitle, { color: theme.text }]}>
            Metrobús L1 · Afluencia
          </Text>
          <Text style={[styles.acercaTxt, { color: theme.textMuted }]}>
            Prototipo académico. No se conecta a sensores ni datos en tiempo
            real: trabaja con datos simulados/históricos que se recalculan cada
            60 s. No maneja datos personales, solo información agregada y
            anonimizada de afluencia.
          </Text>
          <View style={[styles.fuenteRow, { borderTopColor: theme.border }]}>
            <Ionicons name="server-outline" size={16} color={theme.brand} />
            <Text style={[styles.fuenteTxt, { color: theme.text }]}>
              Fuente de datos: <Text style={{ fontWeight: '800' }}>{modoDatos}</Text>
            </Text>
          </View>
        </Card>
      </ScrollView>

      <StationPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={(e) => {
          setEstacionFavoritaId(e.id);
          setEstacionActualId(e.id);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 18,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 18,
  },
  cardRow: {
    padding: 0,
    overflow: 'hidden',
  },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  favNombre: {
    fontSize: 16.5,
    fontWeight: '700',
  },
  favHint: {
    fontSize: 12.5,
    marginTop: 1,
  },
  quitar: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  quitarTxt: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  temaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  temaTxt: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '600',
  },
  acercaTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  acercaTxt: {
    fontSize: 13,
    lineHeight: 19,
  },
  fuenteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fuenteTxt: {
    fontSize: 13,
    fontWeight: '600',
  },
});
