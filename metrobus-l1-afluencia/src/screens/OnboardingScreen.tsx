import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  OnboardingIllustration,
  TipoIlustracion,
} from '../components/OnboardingIllustration';
import { useTheme } from '../theme/ThemeContext';
import { hapticLight, hapticSuccess } from '../utils/haptics';

const { width } = Dimensions.get('window');

interface Slide {
  tipo: TipoIlustracion;
  titulo: string;
  texto: string;
}

const SLIDES: Slide[] = [
  {
    tipo: 'bienvenida',
    titulo: 'Metrobús L1 · Afluencia',
    texto:
      'Decide en segundos si abordas la siguiente unidad, esperas la próxima o tomas una ruta alterna.',
  },
  {
    tipo: 'ocupacion',
    titulo: 'Ocupación de un vistazo',
    texto:
      'Verde, ámbar y rojo te dicen qué tan llena viene cada unidad y qué tan saturado está el andén.',
  },
  {
    tipo: 'estacion',
    titulo: 'Tu estación, en vivo',
    texto:
      'Elige tu estación en el mapa de la línea y consulta tiempos de llegada y personas esperando.',
  },
];

/** Pantalla de bienvenida (primera vez): 3 slides + botón "Empezar". */
export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const theme = useTheme();
  const [indice, setIndice] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== indice) {
      setIndice(i);
      hapticLight();
    }
  };

  const esUltimo = indice === SLIDES.length - 1;
  const avanzar = () => {
    if (esUltimo) {
      hapticSuccess();
      onDone();
    } else {
      scrollRef.current?.scrollTo({ x: (indice + 1) * width, animated: true });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.skipRow}>
        <Pressable onPress={onDone} hitSlop={10}>
          <Text style={[styles.skip, { color: theme.textMuted }]}>Saltar</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <OnboardingIllustration tipo={s.tipo} active={i === indice} />
            <Text style={[styles.titulo, { color: theme.text }]}>{s.titulo}</Text>
            <Text style={[styles.texto, { color: theme.textMuted }]}>{s.texto}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === indice ? theme.brand : theme.border,
                  width: i === indice ? 22 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={avanzar}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: theme.brand, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.btnTxt}>{esUltimo ? 'Empezar' : 'Siguiente'}</Text>
          <Ionicons
            name={esUltimo ? 'checkmark' : 'arrow-forward'}
            size={18}
            color="#fff"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  skipRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  skip: {
    fontSize: 14,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 22,
  },
  iconWrap: {
    width: 132,
    height: 132,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  texto: {
    fontSize: 15.5,
    lineHeight: 23,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 22,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  btnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
