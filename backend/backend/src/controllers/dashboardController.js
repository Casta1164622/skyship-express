/**
 * src/controllers/dashboardController.js
 *
 * Devuelve datos agregados para las graficas del panel admin.
 * El requisito 4.c del enunciado pide "envios por mes, por region, entre otros".
 */

const ShipmentModel = require('../models/shipmentModel');

const DashboardController = {
  async getStats(req, res, next) {
    try {
      const [kpis, byMonth, byRegion, byStatus] = await Promise.all([
        ShipmentModel.getKpis(),
        ShipmentModel.countByMonth(),
        ShipmentModel.countByRegion(),
        ShipmentModel.countByStatus()
      ]);

      res.json({
        kpis,
        byMonth,
        byRegion,
        byStatus
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = DashboardController;
