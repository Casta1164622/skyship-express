/**
 * src/layouts/AdminLayout.jsx
 *
 * Sidebar oscuro fijo a la izquierda + area de contenido a la derecha.
 */

import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <span className="brand-logo">S</span>
          <div>
            <div className="brand-text">SkyShip</div>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </Link>

        <div className="nav-section">PRINCIPAL</div>
        <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span>📊</span> Dashboard
        </NavLink>
        <NavLink to="/admin/envios" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span>📦</span> Envíos
        </NavLink>
        <NavLink to="/admin/usuarios" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span>👥</span> Usuarios
        </NavLink>
        <NavLink to="/admin/contactos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span>✉️</span> Contactos
        </NavLink>

        <div className="nav-section">CUENTA</div>
        <button className="nav-link nav-link-button" onClick={handleLogout}>
          <span>↩️</span> Cerrar sesión
        </button>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-user">
            <div className="avatar admin-avatar">{getInitials(user?.fullName)}</div>
            <div>
              <div className="admin-name">{user?.fullName}</div>
              <div className="admin-role">Administrador</div>
            </div>
          </div>
        </div>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .admin-shell {
          display: grid;
          grid-template-columns: 220px 1fr;
          min-height: 100vh;
        }
        .admin-sidebar {
          background: var(--color-primary-dark);
          color: white;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 6px;
          margin-bottom: 22px;
          color: white;
          text-decoration: none;
        }
        .admin-brand:hover { text-decoration: none; }
        .brand-logo {
          width: 30px; height: 30px;
          background: var(--color-primary-light);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .brand-text { font-size: 13px; font-weight: 500; }
        .brand-sub { font-size: 10px; opacity: 0.6; }
        .nav-section {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          padding-left: 8px;
          letter-spacing: 0.8px;
          font-weight: 600;
          margin-top: 14px;
          margin-bottom: 4px;
        }
        .nav-link {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
          padding: 9px 12px;
          border-radius: 0 6px 6px 0;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 3px solid transparent;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          text-decoration: none;
        }
        .nav-link.active {
          background: rgba(37, 99, 235, 0.25);
          color: white;
          border-left-color: var(--color-primary-lighter);
          font-weight: 500;
        }
        .nav-link-button {
          width: 100%;
          text-align: left;
          background: none;
          font-family: inherit;
          cursor: pointer;
        }
        .admin-main {
          display: flex;
          flex-direction: column;
          background: var(--color-bg);
          min-width: 0;
        }
        .admin-topbar {
          background: white;
          border-bottom: 1px solid var(--color-border);
          padding: 12px 28px;
          display: flex;
          justify-content: flex-end;
        }
        .admin-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-avatar {
          background: var(--color-primary-dark);
        }
        .admin-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text);
        }
        .admin-role {
          font-size: 10px;
          color: var(--color-text-muted);
        }
        .admin-content {
          padding: 24px 28px;
          flex: 1;
        }
        @media (max-width: 768px) {
          .admin-shell { grid-template-columns: 1fr; }
          .admin-sidebar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: auto;
            flex-direction: row;
            padding: 8px;
            gap: 8px;
            overflow-x: auto;
            z-index: 100;
          }
          .admin-brand, .nav-section, .nav-link span:not(:first-child) { display: none; }
          .nav-link { padding: 8px 10px; }
          .admin-content { padding: 16px; padding-bottom: 80px; }
        }
      `}</style>
    </div>
  );
}
