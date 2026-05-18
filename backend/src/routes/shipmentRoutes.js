/**
 * src/routes/shipmentRoutes.js
 *
 * Rutas de envios:
 *   - Cliente autenticado: puede crear y listar sus envios
 *   - Admin: puede hacer CRUD completo de todos los envios
 *
 * Todas requieren login (authMiddleware), pero update y delete
 * adicionalmente requieren ser admin (requireRole).
 */

const express = require('express');
const { body } = require('express-validator');
const ShipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Todas las rutas requieren estar logueado
router.use(authMiddleware);

const createValidations = [
  body('recipientName').trim().isLength({ min: 3 }),
  body('recipientPhone').trim().isLength({ min: 8 }),
  body('destinationDepartment').trim().notEmpty(),
  body('destinationMunicipality').trim().notEmpty(),
  body('destinationAddress').trim().isLength({ min: 5 }),
  body('packageType').isIn(['sobre', 'caja_pequena', 'caja_mediana', 'caja_grande']),
  body('weight').isFloat({ min: 0.1, max: 200 }),
  body('declaredValue').isFloat({ min: 0 })
];

const updateValidations = [
  body('status').isIn(['pendiente', 'en_transito', 'entregado', 'devuelto'])
];

// Rutas del cliente (y admin)
router.get('/', ShipmentController.list);
router.post('/', createValidations, ShipmentController.create);
router.post('/estimate', ShipmentController.estimateCost);
router.get('/:id', ShipmentController.getOne);

// Solo admin
router.put('/:id', requireRole('admin'), updateValidations, ShipmentController.update);
router.delete('/:id', requireRole('admin'), ShipmentController.remove);

module.exports = router;
