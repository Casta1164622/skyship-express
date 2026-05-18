/**
 * src/controllers/userController.js
 *
 * CRUD de usuarios (solo accesible para administradores).
 */

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserModel = require('../models/userModel');

const UserController = {
  async list(req, res, next) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async getOne(req, res, next) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fullName, email, phone, address, password, role } = req.body;

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'El correo ya esta registrado' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const { id } = await UserModel.create({
        fullName, email, phone, address, passwordHash, role: role || 'client'
      });

      res.status(201).json({ id, fullName, email, phone, address, role });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fullName, email, phone, address, role } = req.body;
      const existing = await UserModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await UserModel.update(req.params.id, { fullName, email, phone, address, role });
      res.json({ message: 'Usuario actualizado' });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      // No permitir que el admin se elimine a si mismo
      if (Number(req.params.id) === req.user.id) {
        return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
      }
      await UserModel.remove(req.params.id);
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;
