/**
 * src/routes/userRoutes.js
 *
 * Todas las rutas de usuarios requieren rol admin.
 * Esto se logra encadenando los middlewares: authMiddleware + requireRole('admin').
 */

const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Aplicamos los middlewares a TODAS las rutas de este router
router.use(authMiddleware, requireRole('admin'));

const userValidations = [
  body('fullName').trim().isLength({ min: 3 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 8 }),
  body('address').trim().isLength({ min: 5 }),
  body('role').isIn(['client', 'admin'])
];

router.get('/', UserController.list);
router.get('/:id', UserController.getOne);
router.post('/',
  [...userValidations, body('password').isLength({ min: 6 })],
  UserController.create
);
router.put('/:id', userValidations, UserController.update);
router.delete('/:id', UserController.remove);

module.exports = router;
