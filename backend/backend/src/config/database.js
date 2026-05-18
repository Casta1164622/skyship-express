/**
 * src/config/database.js - Pool de conexiones a MySQL
 *
 * Usamos mysql2/promise para poder hacer queries con async/await
 * en lugar de callbacks (mas limpio y moderno).
 *
 * En lugar de abrir una conexion nueva en cada query, usamos un POOL:
 * un grupo de conexiones reutilizables. Cuando un controller pide
 * la BD, el pool le presta una conexion libre y se la devuelve al
 * terminar. Esto es mucho mas eficiente.
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Prueba la conexion al arrancar el servidor.
 * Si falla, el server.js detiene el proceso para no quedar corriendo "roto".
 */
async function testConnection() {
  const connection = await pool.getConnection();
  console.log('[DB] Conexion a MySQL exitosa');
  connection.release();
}

module.exports = { pool, testConnection };
