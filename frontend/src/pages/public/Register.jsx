/**
 * src/pages/public/Register.jsx
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', password: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: null }));
  }

  function validate() {
    const errs = {};
    if (form.fullName.trim().length < 3) errs.fullName = 'Mínimo 3 caracteres';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Email inválido';
    if (form.phone.trim().length < 8) errs.phone = 'Teléfono inválido';
    if (form.address.trim().length < 5) errs.address = 'Dirección muy corta';
    if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError('');
    if (!validate()) return;

    try {
      setLoading(true);
      await register(form);
      navigate('/cliente');
    } catch (err) {
      setGeneralError(err.response?.data?.error || 'Error al registrar');
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
          <h1>Crear una cuenta</h1>
          <p>Empieza a enviar hoy</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {generalError && <div className="alert alert-error">{generalError}</div>}

          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input className="form-input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Juan Pérez García" />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="5555-1234" />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••" />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="Zona, calle, ciudad" />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <div className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
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
          max-width: 480px;
          overflow: hidden;
        }
        .auth-header {
          background: linear-gradient(135deg, var(--color-primary-dark) 0%, #1E3A8A 100%);
          color: white;
          padding: 26px;
          text-align: center;
        }
        .auth-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 12px;
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
        .auth-form { padding: 22px; }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .auth-submit { width: 100%; margin-top: 6px; }
        .auth-footer {
          text-align: center;
          font-size: 13px;
          color: var(--color-text-muted);
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
}
