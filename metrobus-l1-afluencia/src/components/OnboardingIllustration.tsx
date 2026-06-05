import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

/**
 * Ilustraciones vectoriales propias y animadas para el onboarding. Se dibujan
 * en código (react-native-svg), se adaptan al tema claro/oscuro y la animación
 * "hero" de cada escena se reproduce al volverse el slide activo.
 */

const VERDE = '#1F9D63';
const AMBAR = '#D98A0B';
const ROJO = '#D6383D';
const LINEA = '#D11F2A'; // rojo Metrobús

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const W = 260;
const H = 210;

export type TipoIlustracion = 'bienvenida' | 'ocupacion' | 'estacion';

export function OnboardingIllustration({
  tipo,
  active,
}: {
  tipo: TipoIlustracion;
  active: boolean;
}) {
  const theme = useTheme();

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={theme.card} />
          <Stop offset="1" stopColor={theme.brandSoft} />
        </LinearGradient>
      </Defs>
      {/* Panel de fondo redondeado (da contraste en ambos temas) */}
      <Rect x="0" y="0" width={W} height={H} rx="30" fill="url(#panel)" />
      {tipo === 'bienvenida' && <EscenaBus active={active} theme={theme} />}
      {tipo === 'ocupacion' && <EscenaOcupacion active={active} theme={theme} />}
      {tipo === 'estacion' && <EscenaEstacion active={active} theme={theme} />}
    </Svg>
  );
}

/* --------------------------- Escena 1: el bus entra ----------------------- */
function EscenaBus({ active, theme }: { active: boolean; theme: any }) {
  const tx = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (active) {
      tx.setValue(-150);
      Animated.timing(tx, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [active, tx]);

  const lineaY = 150;
  const nodos = [28, 72, 116, 160, 204, 232];

  return (
    <G>
      {/* Línea troncal + estaciones de fondo */}
      <Rect x="20" y={lineaY - 2.5} width="220" height="5" rx="2.5" fill={LINEA} />
      {nodos.map((x, i) => (
        <Circle
          key={i}
          cx={x}
          cy={lineaY}
          r="6"
          fill={theme.card}
          stroke={LINEA}
          strokeWidth="3"
        />
      ))}

      {/* Bus (entra desde la izquierda) */}
      <AnimatedG x={tx}>
        {/* sombra */}
        <Rect x="78" y="128" width="104" height="10" rx="5" fill="#00000022" />
        {/* carrocería roja */}
        <Rect x="74" y="78" width="112" height="54" rx="12" fill={LINEA} />
        {/* franja plateada */}
        <Rect x="74" y="112" width="112" height="8" fill="#E7E9F2" opacity={0.9} />
        {/* ventanas */}
        <Rect x="84" y="88" width="22" height="16" rx="4" fill="#CFE0F5" />
        <Rect x="112" y="88" width="22" height="16" rx="4" fill="#CFE0F5" />
        <Rect x="140" y="88" width="22" height="16" rx="4" fill="#CFE0F5" />
        {/* faro */}
        <Circle cx="180" cy="100" r="4" fill="#FFE08A" />
        {/* ruedas */}
        <Circle cx="98" cy="134" r="11" fill="#23262F" />
        <Circle cx="98" cy="134" r="4.5" fill="#9AA0B4" />
        <Circle cx="162" cy="134" r="11" fill="#23262F" />
        <Circle cx="162" cy="134" r="4.5" fill="#9AA0B4" />
      </AnimatedG>
    </G>
  );
}

/* ---------------------- Escena 2: el anillo se llena ---------------------- */
function EscenaOcupacion({ active, theme }: { active: boolean; theme: any }) {
  const cx = 130;
  const cy = 88;
  const r = 50;
  const circ = 2 * Math.PI * r;
  const objetivo = 0.72; // 72% de ocupación

  const fill = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (active) {
      fill.setValue(0);
      Animated.timing(fill, {
        toValue: objetivo,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [active, fill]);

  const dashoffset = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [circ, 0],
  });

  // Tres "buses" de color (baja / media / alta)
  const chips = [
    { x: 70, color: VERDE },
    { x: 118, color: AMBAR },
    { x: 166, color: ROJO },
  ];

  return (
    <G>
      {/* Anillo */}
      <G rotation="-90" origin={`${cx}, ${cy}`}>
        <Circle cx={cx} cy={cy} r={r} stroke={theme.trackBg} strokeWidth="16" fill="none" />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          stroke={AMBAR}
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={dashoffset}
        />
      </G>
      {/* punto central */}
      <Circle cx={cx} cy={cy} r="6" fill={AMBAR} />

      {/* Mini-buses de los tres niveles */}
      {chips.map((c, i) => (
        <G key={i}>
          <Rect x={c.x} y="158" width="30" height="20" rx="6" fill={c.color} />
          <Rect x={c.x + 4} y="162" width="6" height="5" rx="1.5" fill="#FFFFFF" opacity={0.9} />
          <Rect x={c.x + 12} y="162" width="6" height="5" rx="1.5" fill="#FFFFFF" opacity={0.9} />
          <Rect x={c.x + 20} y="162" width="6" height="5" rx="1.5" fill="#FFFFFF" opacity={0.9} />
          <Circle cx={c.x + 8} cy="180" r="2.6" fill="#23262F" />
          <Circle cx={c.x + 22} cy="180" r="2.6" fill="#23262F" />
        </G>
      ))}
    </G>
  );
}

/* ----------------- Escena 3: nodo resaltado con su globo ------------------ */
function EscenaEstacion({ active, theme }: { active: boolean; theme: any }) {
  const lineaY = 128;
  const nodos = [40, 90, 140, 190, 230];
  const destacadoX = 140;

  // Pulso continuo del nodo resaltado
  const pulso = useRef(new Animated.Value(11)).current;
  // Caída del globo al activarse
  const globoY = useRef(new Animated.Value(-10)).current;
  const globoOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 14, duration: 700, useNativeDriver: false }),
        Animated.timing(pulso, { toValue: 11, duration: 700, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulso]);

  useEffect(() => {
    if (active) {
      globoY.setValue(-10);
      globoOp.setValue(0);
      Animated.parallel([
        Animated.spring(globoY, { toValue: 0, friction: 6, useNativeDriver: false }),
        Animated.timing(globoOp, { toValue: 1, duration: 400, useNativeDriver: false }),
      ]).start();
    }
  }, [active, globoY, globoOp]);

  return (
    <G>
      {/* Línea + nodos */}
      <Rect x="30" y={lineaY - 2.5} width="200" height="5" rx="2.5" fill={LINEA} />
      {nodos.map((x, i) => {
        const destacado = x === destacadoX;
        if (destacado) return null;
        return (
          <Circle key={i} cx={x} cy={lineaY} r="7" fill={theme.card} stroke={LINEA} strokeWidth="3" />
        );
      })}

      {/* Globo (callout) que cae */}
      <AnimatedG y={globoY} opacity={globoOp}>
        <Rect x={destacadoX - 34} y="58" width="68" height="30" rx="10" fill={theme.card} stroke={theme.brand} strokeWidth="2" />
        <Circle cx={destacadoX - 18} cy="73" r="5" fill={theme.brand} />
        <Rect x={destacadoX - 6} y="69" width="32" height="8" rx="4" fill={theme.border} />
        {/* piquito del globo */}
        <Rect x={destacadoX - 4} y="86" width="8" height="8" rx="2" fill={theme.card} />
      </AnimatedG>

      {/* Nodo resaltado con pulso */}
      <AnimatedCircle cx={destacadoX} cy={lineaY} r={pulso} fill={theme.brand} opacity={0.25} />
      <Circle cx={destacadoX} cy={lineaY} r="9" fill={theme.brand} stroke={theme.card} strokeWidth="3" />
    </G>
  );
}
