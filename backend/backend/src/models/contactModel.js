/**
 * src/models/contactModel.js
 *
 * Acceso a la tabla `contact_messages`.
 * Guarda los mensajes que llegan por el formulario de contacto del landing.
 */

const { pool } = require('../config/database');

const ContactModel = {
  async create({ name, email, subject, message }) {
    const [result] = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    );
    return { id: result.insertId };
  },

  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    return rows;
  }
};

module.exports = ContactModel;
