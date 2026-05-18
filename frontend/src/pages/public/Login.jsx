/**
 * src/pages/public/Login.jsx
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/cliente');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <span className="brand-logo">S</span>
            <span>SkyShip Express</span>
          </Link>
          <h1>Bienvenido de vuelta</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <div className="auth-footer">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </div>
        </form>
      </div>

      <style>{`
        .auth-page {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          background: var(--color-bg);
        }
        .auth-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          width: 100%;
          max-width: 420px;
          overflow: hidden;
        }
        .auth-header {
          background: linear-gradient(135deg, var(--color-primary-dark) 0%, #1E3A8A 100%);
          color: white;
          padding: 28px;
          text-align: center;
        }
        .auth-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 14px;
          text-decoration: none;
        }
        .auth-brand:hover { text-decoration: none; }
        .brand-logo {
          width: 30px; height: 30px;
          background: var(--color-primary-light);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .auth-header h1 {
          font-size: 20px;
          font-weight: 600;
        }
        .auth-header p {
          font-size: 13px;
          opacity: 0.85;
          margin-top: 4px;
        }
        .auth-form { padding: 24px; }
        .auth-submit { width: 100%; margin-top: 6px; }
        .auth-footer {
          text-align: center;
          font-size: 13px;
          color: var(--color-text-muted);
          margin-top: 18px;
        }
      `}</style>
    </div>
  );
}
