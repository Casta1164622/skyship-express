/**
 * src/services/shipmentService.js
 *
 * Funciones para hablar con los endpoints de envios.
 */

import api from './api';

export const shipmentService = {
  async list() {
    const { data } = await api.get('/shipments');
    return data;
  },

  async getOne(id) {
    const { data } = await api.get(`/shipments/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/shipments', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/shipments/${id}`, payload);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/shipments/${id}`);
    return data;
  },

  async estimate(payload) {
    const { data } = await api.post('/shipments/estimate', payload);
    return data;
  }
};
