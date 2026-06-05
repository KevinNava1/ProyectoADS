# Metrobús L1 · Afluencia

Prototipo móvil (React Native + Expo) para consultar, de un vistazo, la
**afluencia de la Línea 1 del Metrobús de la CDMX** (corredor Av. Insurgentes):
tiempo estimado de llegada de la próxima unidad, nivel de ocupación y personas
esperando en el andén.

> ⚠️ **Prototipo académico.** No se conecta a sensores ni datos en tiempo real.
> Trabaja con **datos simulados** que se recalculan cada 60 s. No maneja datos
> personales: solo información agregada y anonimizada.

## Cómo ejecutarlo

```bash
cd metrobus-l1-afluencia
npm install        # solo la primera vez
npx expo start     # abre el panel de Expo
```

Luego:

- **En tu celular:** instala la app **Expo Go** (Android/iOS) y escanea el
  código QR que aparece en la terminal.
- **En el navegador:** pulsa la tecla `w` (requiere `npx expo install react-dom
  react-native-web` la primera vez).
- **Emulador Android:** pulsa `a`. **Simulador iOS (solo macOS):** pulsa `i`.

## Pantallas

1. **Inicio / Dashboard** — selector de estación con buscador, tarjeta dominante
   de la próxima unidad (cuenta regresiva + anillo de ocupación), personas en el
   andén y lista de las siguientes unidades.
2. **Mapa de la Línea 1** — vista esquemática tipo "mapa de metro" con cada
   estación codificada por color según su afluencia.
3. **Detalle de estación** — ocupación actual, gráfica de afluencia por horario
   (horas pico) y próximas unidades.
4. **Ajustes** — estación favorita y tema claro / oscuro / sistema.

## Sistema de color (semántico)

| Nivel | Color  | Ícono | Significado          |
|-------|--------|-------|----------------------|
| BAJA  | Verde  | ✓     | Ocupación < 40%      |
| MEDIA | Ámbar  | !     | Ocupación 40–75%     |
| ALTA  | Rojo   | ⚠     | Ocupación > 75%      |

La información **nunca depende solo del color**: cada nivel lleva ícono y
etiqueta (accesibilidad / contraste).

## Estructura del código

```
src/
  types/models.ts          Modelo de datos (basado en el diagrama de clases):
                           Estacion, Unidad, RegistroAcceso, MetricaAfluencia,
                           NivelOcupacion, TipoEvento.
  data/estaciones.ts       Datos semilla (seed) de estaciones de la Línea 1.
  data/simulation.ts       Motor de simulación: ocupación, personas en espera,
                           ETA por hora del día, perfil de afluencia.
  context/AppDataContext   Estado global: reloj de 1 s + refresco cada 60 s.
  theme/                   Paleta, colores semánticos y modo claro/oscuro.
  components/              Gauge de ocupación, cuenta regresiva, tarjetas,
                           mapa de línea, gráfica, buscador, etc.
  screens/                 Las 4 pantallas.
  navigation/              Pestañas inferiores + stack (detalle de estación).
```

## Lógica de estimación (simplificada)

- **Ocupación de unidad** = `pasajerosABordo / capacidadMaxima` →
  `< 40%` BAJA, `40–75%` MEDIA, `> 75%` ALTA.
- **Personas en espera** ≈ demanda de la hora × capacidad del andén × factor.
- **Tiempo de llegada** = frecuencia de paso promedio (headway) ajustada por la
  hora del día, con dos horas pico (~8:00 y ~18:00).
- Todo se **recalcula cada 60 s** para simular actualización periódica; la
  cuenta regresiva avanza con un reloj de 1 s.

Las variaciones son **deterministas**: para un mismo instante y estación el
resultado es estable (no parpadea), pero evoluciona de forma realista con el
tiempo del día.
