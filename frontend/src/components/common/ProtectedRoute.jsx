/**
 * src/components/common/ProtectedRoute.jsx
 *
 * Envuelve rutas que requieren login.
 * Si no hay usuario, redirige a /login.
 * Si se pasa un rol, ademas verifica que el usuario tenga ese rol.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    // Si es cliente intentando entrar a admin, lo mandamos a su panel
    const fallback = user.role === 'admin' ? '/admin' : '/cliente';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
