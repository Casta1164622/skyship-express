/**
 * src/routes/dashboardRoutes.js
 *
 * Estadisticas para el panel administrativo. Solo admin.
 */

const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/stats',
  authMiddleware,
  requireRole('admin'),
  DashboardController.getStats
);

module.exports = router;
