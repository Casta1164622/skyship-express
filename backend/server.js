/**
 * server.js - Punto de entrada de la aplicacion
 *
 * Este archivo es lo primero que se ejecuta cuando arrancamos el backend.
 * Su responsabilidad unica es:
 *   1. Cargar las variables de entorno desde .env
 *   2. Importar la app de Express ya configurada
 *   3. Probar la conexion a la base de datos
 *   4. Arrancar el servidor en el puerto indicado
 */

require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 4000;

// Antes de arrancar, verificamos que la conexion a MySQL funcione.
// Si falla, el servidor se cierra para no quedar corriendo "roto".
testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[SkyShip API] Servidor corriendo en http://localhost:${PORT}`);
      console.log(`[SkyShip API] Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('[SkyShip API] No se pudo conectar a MySQL:', error.message);
    process.exit(1);
  });
