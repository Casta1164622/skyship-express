/**
 * src/controllers/authController.js
 *
 * Maneja login y registro.
 *
 * Flujo de registro:
 *   1. Validaciones (las hace el router con express-validator)
 *   2. Verificar que el email no exista
 *   3. Hashear la contrasena con bcrypt
 *   4. Guardar en BD
 *   5. Devolver token JWT
 *
 * Flujo de login:
 *   1. Buscar usuario por email
 *   2. Comparar contrasena enviada vs hash guardado
 *   3. Si coincide, generar token JWT
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const UserModel = require('../models/userModel');

/**
 * Crea un token JWT para un usuario.
 * El token contiene id, email y role (lo que necesitamos para autorizar).
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

const AuthController = {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fullName, email, phone, address, password } = req.body;

      // Verificar que el email no este registrado
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'El correo ya esta registrado' });
      }

      // Hashear la contrasena (10 = vueltas de salt, balance entre seguridad y velocidad)
      const passwordHash = await bcrypt.hash(password, 10);

      const { id } = await UserModel.create({
        fullName, email, phone, address, passwordHash, role: 'client'
      });

      const user = { id, email, role: 'client' };
      const token = generateToken(user);

      res.status(201).json({
        message: 'Usuario registrado correctamente',
        token,
        user: { id, fullName, email, phone, address, role: 'client' }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await UserModel.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'Credenciales invalidas' });
      }

      const passwordOk = await bcrypt.compare(password, user.password_hash);
      if (!passwordOk) {
        return res.status(401).json({ error: 'Credenciales invalidas' });
      }

      const token = generateToken(user);

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Devuelve los datos del usuario logueado (basado en su token).
   * Util para el frontend cuando refresca la pagina y quiere validar el token.
   */
  async me(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;
