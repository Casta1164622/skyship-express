/**
 * src/routes/authRoutes.js
 *
 * Define las URLs de autenticacion y aplica validaciones con express-validator.
 *
 * Las validaciones se ejecutan ANTES del controller. Si fallan,
 * el controller revisa validationResult() y devuelve 400 con los errores.
 */

const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const registerValidations = [
  body('fullName').trim().isLength({ min: 3 }).withMessage('Nombre minimo 3 caracteres'),
  body('email').trim().isEmail().withMessage('Email invalido').normalizeEmail(),
  body('phone').trim().isLength({ min: 8 }).withMessage('Telefono invalido'),
  body('address').trim().isLength({ min: 5 }).withMessage('Direccion muy corta'),
  body('password').isLength({ min: 6 }).withMessage('Password minimo 6 caracteres')
];

const loginValidations = [
  body('email').trim().isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password').notEmpty().withMessage('Password requerido')
];

router.post('/register', registerValidations, AuthController.register);
router.post('/login', loginValidations, AuthController.login);
router.get('/me', authMiddleware, AuthController.me);

module.exports = router;
