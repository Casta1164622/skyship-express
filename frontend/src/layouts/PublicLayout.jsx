/**
 * src/layouts/PublicLayout.jsx
 *
 * Header con logo y CTAs de login/registro. Para paginas publicas.
 */

import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { user } = useAuth();

  return (
    <>
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/" className="brand">
            <span className="brand-logo">S</span>
            <span className="brand-text">SkyShip Express</span>
          </Link>

          <nav className="public-nav">
            <a href="/#servicios">Servicios</a>
            <a href="/#nosotros">Nosotros</a>
            <a href="/#faq">FAQ</a>
            <a href="/#contacto">Contacto</a>
          </nav>

          <div className="public-cta">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/cliente'}
                className="btn btn-primary"
              >
                Ir al panel
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Iniciar sesión</Link>
                <Link to="/registro" className="btn btn-primary">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <style>{`
        .public-header {
          background: var(--color-primary-dark);
          color: white;
          padding: 14px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .public-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-weight: 500;
          text-decoration: none;
        }
        .brand:hover { text-decoration: none; }
        .brand-logo {
          width: 32px; height: 32px;
          background: var(--color-primary-light);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .brand-text { font-size: 15px; }
        .public-nav {
          display: flex;
          gap: 22px;
          font-size: 13px;
        }
        .public-nav a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
        }
        .public-nav a:hover { color: white; }
        .public-cta {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .public-cta .btn-ghost {
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .public-cta .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 768px) {
          .public-nav { display: none; }
        }
      `}</style>
    </>
  );
}
