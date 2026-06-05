import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../theme/ThemeContext';
import { colorNivel } from '../theme/palette';
import { Estacion } from '../types/models';
import { hapticSelect } from '../utils/haptics';
import { OccupancyBadge } from './OccupancyBadge';
import { StationIcon } from './StationIcon';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (estacion: Estacion) => void;
}

/** Quita acentos y mayúsculas para una búsqueda tolerante. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // elimina diacríticos (acentos)
}

/**
 * Modal con buscador para elegir la estación actual. Cada resultado muestra
 * su nivel de afluencia para que la selección ya sea informativa.
 */
export function StationPickerModal({ visible, onClose, onSelect }: Props) {
  const theme = useTheme();
  const { estaciones, estadoDe, estacionActual } = useAppData();
  const [query, setQuery] = useState('');

  const filtradas = useMemo(() => {
    const q = normalizar(query.trim());
    if (!q) return estaciones;
    return estaciones.filter((e) => normalizar(e.nombre).includes(q));
  }, [query, estaciones]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Elegir estación
          </Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={26} color={theme.textMuted} />
          </Pressable>
        </View>

        <View
          style={[
            styles.search,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search" size={18} color={theme.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar estación de la Línea 1…"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text }]}
            autoFocus
          />
        </View>

        <FlatList
          data={filtradas}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ padding: 16, paddingTop: 4 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const estado = estadoDe(item);
            const activa = item.id === estacionActual.id;
            return (
              <Pressable
                onPress={() => {
                  hapticSelect();
                  onSelect(item);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.row,
                  {
                    backgroundColor: theme.card,
                    borderColor: activa ? theme.brand : theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <StationIcon
                  estacionId={item.id}
                  color={colorNivel(estado.nivelAnden, theme)}
                  size={38}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.nombre, { color: theme.text }]}>
                    {item.nombre}
                  </Text>
                  <Text style={[styles.ubic, { color: theme.textMuted }]} numberOfLines={1}>
                    {item.ubicacion}
                  </Text>
                </View>
                <OccupancyBadge nivel={estado.nivelAnden} size="sm" />
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
  },
  ubic: {
    fontSize: 12.5,
    marginTop: 1,
  },
});
