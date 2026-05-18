/**
 * src/controllers/shipmentController.js
 *
 * Maneja la creacion, lectura, actualizacion y eliminacion de envios.
 *
 * Reglas de autorizacion:
 *   - Cliente: solo puede CREAR y VER sus propios envios
 *   - Admin: puede hacer todo (CRUD completo, ver de todos)
 */

const { validationResult } = require('express-validator');
const ShipmentModel = require('../models/shipmentModel');
const {
  generateTrackingCode,
  calculateShippingCost
} = require('../utils/generateTrackingCode');

const ShipmentController = {
  /**
   * Crea un envio.
   * El cliente solo puede crearlos para si mismo (user_id = req.user.id).
   */
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        recipientName, recipientPhone,
        destinationDepartment, destinationMunicipality, destinationAddress,
        packageType, weight, declaredValue, description
      } = req.body;

      // Calculamos el costo en el backend (NUNCA confiar en lo que mande el frontend)
      const cost = calculateShippingCost({
        department: destinationDepartment,
        weight: parseFloat(weight),
        packageType
      });

      const { id } = await ShipmentModel.create({
        userId: req.user.id,
        recipientName, recipientPhone,
        destinationDepartment, destinationMunicipality, destinationAddress,
        packageType, weight, declaredValue, description,
        cost
      });

      // Generamos el codigo de guia con el id que nos dio MySQL
      const trackingCode = generateTrackingCode(id);
      await ShipmentModel.setTrackingCode(id, trackingCode);

      const shipment = await ShipmentModel.findById(id);
      res.status(201).json(shipment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Lista los envios. Si es cliente, solo los suyos. Si es admin, todos.
   */
  async list(req, res, next) {
    try {
      let shipments;
      if (req.user.role === 'admin') {
        shipments = await ShipmentModel.findAll();
      } else {
        shipments = await ShipmentModel.findByUserId(req.user.id);
      }
      res.json(shipments);
    } catch (error) {
      next(error);
    }
  },

  async getOne(req, res, next) {
    try {
      const shipment = await ShipmentModel.findById(req.params.id);
      if (!shipment) {
        return res.status(404).json({ error: 'Envio no encontrado' });
      }
      // Cliente solo puede ver sus propios envios
      if (req.user.role !== 'admin' && shipment.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes acceso a este envio' });
      }
      res.json(shipment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualiza un envio. Solo admin.
   */
  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existing = await ShipmentModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Envio no encontrado' });
      }

      await ShipmentModel.update(req.params.id, req.body);
      const updated = await ShipmentModel.findById(req.params.id);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Elimina un envio. Solo admin.
   */
  async remove(req, res, next) {
    try {
      await ShipmentModel.remove(req.params.id);
      res.json({ message: 'Envio eliminado' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Calcula el costo estimado SIN crear el envio.
   * El frontend lo usa mientras el cliente llena el formulario.
   */
  async estimateCost(req, res, next) {
    try {
      const { destinationDepartment, weight, packageType } = req.body;
      const cost = calculateShippingCost({
        department: destinationDepartment,
        weight: parseFloat(weight) || 1,
        packageType: packageType || 'caja_pequena'
      });
      res.json({ cost });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ShipmentController;
