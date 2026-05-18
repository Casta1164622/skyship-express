/**
 * src/middlewares/roleMiddleware.js
 *
 * Verifica que el usuario autenticado tenga el rol indicado.
 * Se usa DESPUES de authMiddleware (que ya puso req.user).
 *
 * Uso:
 *   router.get('/admin/usuarios', authMiddleware, requireRole('admin'), handler);
 */

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para esta accion' });
    }
    next();
  };
}

module.exports = { requireRole };
