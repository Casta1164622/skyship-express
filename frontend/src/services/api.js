/**
 * src/services/api.js
 *
 * Instancia de Axios configurada con:
 *   - baseURL del backend (desde .env)
 *   - Interceptor que agrega el token JWT a cada peticion automaticamente
 *   - Interceptor que detecta token expirado y manda al login
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de peticiones: agrega el token JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skyship_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuestas: si el backend devuelve 401, limpiamos el token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('skyship_token');
        localStorage.removeItem('skyship_user');
        if (window.location.pathname.startsWith('/cliente') || window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
