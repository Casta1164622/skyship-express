/**
 * src/models/userModel.js
 *
 * Toda la interaccion con la tabla `users` pasa por aqui.
 * Los controllers NUNCA escriben SQL directo: piden a este modelo.
 * Asi, si manana cambiamos de MySQL a otra BD, solo cambiamos los modelos.
 *
 * Esto es una buena practica conocida como "separacion de capas".
 */

const { pool } = require('../config/database');

const UserModel = {
  /**
   * Busca un usuario por email (para el login).
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Busca un usuario por id.
   */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Crea un nuevo usuario (registro).
   * Recibe la contrasena ya hasheada.
   */
  async create({ fullName, email, phone, address, passwordHash, role = 'client' }) {
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, phone, address, password_hash, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, address, passwordHash, role]
    );
    return { id: result.insertId };
  },

  /**
   * Lista todos los usuarios (admin).
   */
  async findAll() {
    const [rows] = await pool.query(
      `SELECT id, full_name, email, phone, address, role, created_at
       FROM users ORDER BY created_at DESC`
    );
    return rows;
  },

  /**
   * Actualiza un usuario (admin).
   */
  async update(id, { fullName, email, phone, address, role }) {
    await pool.query(
      `UPDATE users
       SET full_name = ?, email = ?, phone = ?, address = ?, role = ?
       WHERE id = ?`,
      [fullName, email, phone, address, role, id]
    );
  },

  /**
   * Elimina un usuario.
   */
  async remove(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = UserModel;
