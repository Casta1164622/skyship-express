/**
 * src/context/AuthContext.jsx
 *
 * Context global de autenticacion.
 * Cualquier componente puede saber:
 *   - Si hay un usuario logueado (user)
 *   - Si esta cargando la verificacion inicial (loading)
 *   - Como hacer login, register y logout
 *
 * El estado se persiste en localStorage para que sobreviva al refresh.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, vemos si hay un usuario guardado en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('skyship_user');
    const savedToken = localStorage.getItem('skyship_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await authService.login(email, password);
    localStorage.setItem('skyship_token', response.token);
    localStorage.setItem('skyship_user', JSON.stringify(response.user));
    setUser(response.user);
    return response.user;
  }

  async function register(userData) {
    const response = await authService.register(userData);
    localStorage.setItem('skyship_token', response.token);
    localStorage.setItem('skyship_user', JSON.stringify(response.user));
    setUser(response.user);
    return response.user;
  }

  function logout() {
    localStorage.removeItem('skyship_token');
    localStorage.removeItem('skyship_user');
    setUser(null);
  }

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
