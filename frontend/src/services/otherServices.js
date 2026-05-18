/**
 * src/services/otherServices.js
 *
 * Servicios mas pequenos: contacto y dashboard.
 */

import api from './api';

export const contactService = {
  async send(payload) {
    const { data } = await api.post('/contact', payload);
    return data;
  },
  async list() {
    const { data } = await api.get('/contact');
    return data;
  }
};

export const dashboardService = {
  async getStats() {
    const { data } = await api.get('/dashboard/stats');
    return data;
  }
};
