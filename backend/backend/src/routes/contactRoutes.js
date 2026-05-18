/**
 * src/routes/contactRoutes.js
 *
 * El POST es publico (cualquiera puede enviar un mensaje).
 * El GET (para ver mensajes) es solo para admin.
 */

const express = require('express');
const { body } = require('express-validator');
const ContactController = require('../controllers/contactController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

const validations = [
  body('name').trim().isLength({ min: 3 }).withMessage('Nombre minimo 3 caracteres'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Email invalido'),
  body('subject').trim().isLength({ min: 3 }).withMessage('Asunto requerido'),
  body('message').trim().isLength({ min: 10 }).withMessage('Mensaje minimo 10 caracteres')
];

router.post('/', validations, ContactController.create);
router.get('/', authMiddleware, requireRole('admin'), ContactController.list);

module.exports = router;
