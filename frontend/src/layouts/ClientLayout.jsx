/**
 * src/layouts/ClientLayout.jsx
 *
 * Header con tabs de navegacion y avatar del cliente.
 */

import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <header className="client-header">
        <div className="client-header-inner">
          <Link to="/" className="brand">
            <span className="brand-logo">S</span>
            <span className="brand-text">SkyShip Express</span>
          </Link>

          <nav className="client-nav">
            <NavLink to="/cliente" end className={({ isActive }) => isActive ? 'active' : ''}>
              Mis envíos
            </NavLink>
            <NavLink to="/cliente/nuevo-envio" className={({ isActive }) => isActive ? 'active' : ''}>
              Nuevo envío
            </NavLink>
          </nav>

          <div className="client-user">
            <span className="user-name">{user?.fullName}</span>
            <div className="avatar">{getInitials(user?.fullName)}</div>
            <button onClick={handleLogout} className="btn-logout" title="Cerrar sesión">
              ↩
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <style>{`
        .client-header {
          background: var(--color-primary-dark);
          color: white;
          padding: 12px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .client-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          text-decoration: none;
        }
        .brand:hover { text-decoration: none; }
        .brand-logo {
          width: 28px; height: 28px;
          background: var(--color-primary-light);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }
        .brand-text { font-size: 14px; font-weight: 500; }
        .client-nav {
          display: flex;
          gap: 24px;
          font-size: 13px;
        }
        .client-nav a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          padding: 4px 0;
          border-bottom: 2px solid transparent;
        }
        .client-nav a:hover { color: white; }
        .client-nav a.active {
          color: white;
          border-bottom-color: var(--color-primary-lighter);
        }
        .client-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-name {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.85);
        }
        .avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: var(--color-primary-light);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
        }
        .btn-logout {
          color: rgba(255, 255, 255, 0.7);
          padding: 4px 8px;
          border-radius: 5px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        @media (max-width: 768px) {
          .user-name { display: none; }
          .client-nav { gap: 14px; }
        }
      `}</style>
    </>
  );
}
