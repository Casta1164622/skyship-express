/**
 * src/controllers/contactController.js
 *
 * Maneja el formulario de contacto del landing publico.
 * Cualquier visitante puede mandar un mensaje (no requiere login).
 */

const { validationResult } = require('express-validator');
const ContactModel = require('../models/contactModel');

const ContactController = {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;
      const { id } = await ContactModel.create({ name, email, subject, message });
      res.status(201).json({
        message: 'Mensaje recibido. Te contactaremos pronto.',
        id
      });
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const messages = await ContactModel.findAll();
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ContactController;
