/**
 * src/pages/public/NotFound.jsx
 */

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="content">
        <div className="icon">📦</div>
        <div className="code">404</div>
        <h1>Página no encontrada</h1>
        <p>La página que buscas no existe o fue movida.</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>

      <style>{`
        .not-found {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }
        .content {
          text-align: center;
          max-width: 400px;
        }
        .icon { font-size: 64px; margin-bottom: 12px; }
        .code {
          font-size: 64px;
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1;
        }
        .content h1 {
          font-size: 22px;
          color: var(--color-primary-dark);
          margin: 14px 0 6px;
        }
        .content p {
          color: var(--color-text-muted);
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
