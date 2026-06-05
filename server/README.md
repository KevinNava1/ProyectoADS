# Metrobús L1 – Afluencia · Backend (API REST)

Backend del prototipo, en **Node + Express + TypeScript + SQLite**.

> Arquitectura completa: **App (Expo) → API REST (Express) → SQLite**
> El **dominio** (modelo de clases + motor de simulación) es **compartido** con
> la app: los archivos `src/types/models.ts`, `src/data/estaciones.ts` y
> `src/data/simulation.ts` son los mismos de la app, reutilizados aquí.

## Qué hace

La tabla `registro_acceso` modela la entidad **RegistroAcceso** del diagrama:
cada fila es un evento de torniquete (`ENTRADA` / `SALIDA`) de una estación.
El backend **agrega** esos eventos con SQL para producir las métricas de
afluencia — justo lo que haría un sistema real conectado a los torniquetes.

- **Lo que vendría de sensores reales** (entradas/salidas, gente en andén) se
  calcula desde los eventos almacenados en SQLite.
- **Lo que no tiene sensor** en este prototipo (posición/ETA de las unidades) se
  estima con el motor de simulación compartido.

## Cómo ejecutarlo

```bash
cd server
npm install      # solo la primera vez
npm start        # levanta la API en http://localhost:4000
                 # (la primera vez siembra la base con eventos de hoy)
```

- `npm run dev` — modo desarrollo con recarga automática (tsx watch).
- `npm run seed` — vuelve a sembrar la base desde cero.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servicio |
| GET | `/api/estaciones` | Catálogo de estaciones (norte→sur) |
| GET | `/api/estados` | Resumen (nivel + espera) de todas — para el mapa |
| GET | `/api/estaciones/:id/estado` | Estado de afluencia completo de una estación |
| GET | `/api/estaciones/:id/afluencia` | Afluencia por horario (agregada por SQL) |

Ejemplo:

```bash
curl http://localhost:4000/api/estaciones/insurgentes/estado
curl http://localhost:4000/api/estaciones/insurgentes/afluencia
```

## Conectar la app al backend

En `metrobus-l1-afluencia/src/config.ts`:

```ts
export const USE_BACKEND = true;            // cambia de false a true
export const API_URL = 'http://localhost:4000';
```

- En **web / emulador**: `localhost` funciona.
- En **celular físico (Expo Go)**: usa la **IP LAN** de tu PC
  (p. ej. `http://192.168.1.50:4000`) y asegúrate de estar en la misma red.

Con `USE_BACKEND = false` la app usa la simulación **local/offline** (modo por
defecto, ideal para exponer sin depender de la red).

## Estructura

```
src/
  types/models.ts      Modelo de clases (compartido con la app)
  data/estaciones.ts   Seed de estaciones de la L1 (compartido)
  data/simulation.ts   Motor de simulación (compartido)
  db.ts                SQLite: esquema de registro_acceso
  seed.ts              Siembra de eventos de torniquete (perfil por hora)
  repository.ts        Consultas SQL de agregación
  service.ts           Combina BD + simulación → respuestas de la API
  routes.ts            Rutas REST
  server.ts            Punto de entrada (Express)
```
