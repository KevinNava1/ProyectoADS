import cors from 'cors';
import express from 'express';
import { router } from './routes';
import { sembrarSiVacio } from './seed';

/**
 * Punto de entrada del backend "Metrobús L1 – Afluencia".
 *
 * Arquitectura:  App (Expo)  →  API REST (Express)  →  SQLite
 * El dominio (modelo de clases + simulación) es COMPARTIDO con la app.
 */
const PORT = Number(process.env.PORT ?? 4000);

const app = express();
app.use(cors()); // permite que la app móvil consuma la API
app.use(express.json());
app.use('/api', router);

app.get('/', (_req, res) => {
  res.send('Metrobús L1 – Afluencia · API REST. Ver /api/health');
});

// Siembra la base la primera vez (eventos de torniquete de hoy).
sembrarSiVacio();

app.listen(PORT, () => {
  console.log(`🚍 API Metrobús L1 escuchando en http://localhost:${PORT}`);
  console.log(`   Prueba:  http://localhost:${PORT}/api/health`);
});
