/**
 * src/models/shipmentModel.js
 *
 * Acceso a la tabla `shipments`.
 * Las consultas para el dashboard del admin tambien estan aqui
 * (agrupadas por mes, por region, etc.).
 */

const { pool } = require('../config/database');

const ShipmentModel = {
  /**
   * Crea un nuevo envio. El codigo de guia se asigna DESPUES
   * en el controller, una vez que sabemos el id autogenerado.
   */
  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO shipments (
        user_id, recipient_name, recipient_phone,
        destination_department, destination_municipality, destination_address,
        package_type, weight_lb, declared_value, description,
        status, cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId, data.recipientName, data.recipientPhone,
        data.destinationDepartment, data.destinationMunicipality, data.destinationAddress,
        data.packageType, data.weight, data.declaredValue, data.description,
        'pendiente', data.cost
      ]
    );
    return { id: result.insertId };
  },

  /**
   * Asigna el codigo de guia a un envio recien creado.
   */
  async setTrackingCode(id, trackingCode) {
    await pool.query(
      'UPDATE shipments SET tracking_code = ? WHERE id = ?',
      [trackingCode, id]
    );
  },

  /**
   * Lista los envios de un usuario (panel del cliente).
   */
  async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT id, tracking_code, recipient_name, destination_department,
              destination_municipality, status, cost, created_at
       FROM shipments
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  /**
   * Lista TODOS los envios con datos del cliente (admin).
   */
  async findAll() {
    const [rows] = await pool.query(
      `SELECT s.*, u.full_name AS client_name, u.email AS client_email
       FROM shipments s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    return rows;
  },

  /**
   * Busca un envio por id.
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT s.*, u.full_name AS client_name, u.email AS client_email
       FROM shipments s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Actualiza un envio (admin).
   */
  async update(id, data) {
    await pool.query(
      `UPDATE shipments
       SET recipient_name = ?, recipient_phone = ?,
           destination_department = ?, destination_municipality = ?, destination_address = ?,
           status = ?, cost = ?
       WHERE id = ?`,
      [
        data.recipientName, data.recipientPhone,
        data.destinationDepartment, data.destinationMunicipality, data.destinationAddress,
        data.status, data.cost, id
      ]
    );
  },

  /**
   * Elimina un envio.
   */
  async remove(id) {
    await pool.query('DELETE FROM shipments WHERE id = ?', [id]);
  },

  // ===== Estadisticas para el dashboard admin =====

  /**
   * Cuenta envios agrupados por mes (ultimos 6 meses).
   */
  async countByMonth() {
    const [rows] = await pool.query(
      `SELECT
         DATE_FORMAT(created_at, '%Y-%m') AS month,
         COUNT(*) AS total
       FROM shipments
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month
       ORDER BY month ASC`
    );
    return rows;
  },

  /**
   * Cuenta envios agrupados por departamento.
   */
  async countByRegion() {
    const [rows] = await pool.query(
      `SELECT destination_department AS region, COUNT(*) AS total
       FROM shipments
       GROUP BY destination_department
       ORDER BY total DESC`
    );
    return rows;
  },

  /**
   * Cuenta envios agrupados por estado.
   */
  async countByStatus() {
    const [rows] = await pool.query(
      `SELECT status, COUNT(*) AS total
       FROM shipments
       GROUP BY status`
    );
    return rows;
  },

  /**
   * Resumen general para las tarjetas KPI del admin.
   */
  async getKpis() {
    const [[totals]] = await pool.query(
      `SELECT
         COUNT(*) AS total_shipments,
         SUM(CASE WHEN status = 'en_transito' THEN 1 ELSE 0 END) AS in_transit,
         SUM(CASE WHEN status = 'entregado' THEN 1 ELSE 0 END) AS delivered,
         SUM(CASE WHEN status = 'pendiente' THEN 1 ELSE 0 END) AS pending,
         COALESCE(SUM(cost), 0) AS total_revenue
       FROM shipments`
    );
    return totals;
  }
};

module.exports = ShipmentModel;
