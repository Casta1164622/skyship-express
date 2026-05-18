/**
 * src/middlewares/authMiddleware.js
 *
 * Middleware que verifica el token JWT que viene en el header Authorization.
 * Si es valido, agrega los datos del usuario a req.user y continua.
 * Si no, devuelve 401 (no autorizado).
 *
 * Se aplica a las rutas que requieren login (envios, perfil, admin).
 */

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // El token viene asi:  Authorization: Bearer eyJhbGc...
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded contiene { id, email, role } que pusimos al generar el token
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
}

module.exports = authMiddleware;
