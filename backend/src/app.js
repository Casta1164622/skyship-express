/**
 * src/app.js - Configuracion central de Express
 *
 * Aqui definimos:
 *   - Middlewares globales (CORS, JSON parser)
 *   - Las rutas que expone la API (montadas con un prefijo)
 *   - El manejador de errores global
 *
 * NO arrancamos el servidor aqui (eso lo hace server.js).
 * De esta forma, podriamos testear app.js sin levantar un puerto real.
 */

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// === MIDDLEWARES GLOBALES ===

// CORS: permite que el frontend (otro origen, ej. localhost:5173)
// pueda hacer peticiones a este backend (localhost:4000).
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parser JSON: convierte el body de las peticiones (que viene como string)
// en un objeto JS accesible desde req.body.
app.use(express.json());

// === RUTAS ===
// Cada grupo de rutas se monta bajo un prefijo distinto.
// Asi, las URLs quedan organizadas: /api/auth/login, /api/shipments, etc.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de salud: util para verificar que el servidor responde.
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SkyShip API funcionando' });
});

// === MANEJO DE ERRORES ===

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler global - captura cualquier error no manejado en los controllers
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
