/**
 * src/pages/client/NewShipment.jsx
 *
 * Formulario para crear un envio con calculo de costo en tiempo real.
 * El backend recalcula el costo al guardar (nunca confiar en el frontend).
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { shipmentService } from '../../services/shipmentService';
import { LOCATIONS, DEPARTMENTS, PACKAGE_TYPES, formatCurrency } from '../../utils/locations';

export default function NewShipment() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '',
    destinationDepartment: '',
    destinationMunicipality: '',
    destinationAddress: '',
    packageType: 'caja_pequena',
    weight: '1',
    declaredValue: '0',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Recalcular costo cuando cambia algo relevante
  useEffect(() => {
    if (!form.destinationDepartment) {
      setEstimatedCost(0);
      return;
    }

    const handler = setTimeout(() => {
      shipmentService.estimate({
        destinationDepartment: form.destinationDepartment,
        weight: form.weight,
        packageType: form.packageType
      }).then(({ cost }) => setEstimatedCost(cost))
        .catch(() => setEstimatedCost(0));
    }, 200);

    return () => clearTimeout(handler);
  }, [form.destinationDepartment, form.weight, form.packageType]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      // Si cambia el departamento, reseteamos el municipio
      if (name === 'destinationDepartment') {
        next.destinationMunicipality = '';
      }
      return next;
    });
    setErrors(prev => ({ ...prev, [name]: null }));
  }

  function validate() {
    const errs = {};
    if (form.recipientName.trim().length < 3) errs.recipientName = 'Mínimo 3 caracteres';
    if (form.recipientPhone.trim().length < 8) errs.recipientPhone = 'Teléfono inválido';
    if (!form.destinationDepartment) errs.destinationDepartment = 'Selecciona un departamento';
    if (!form.destinationMunicipality) errs.destinationMunicipality = 'Selecciona un municipio';
    if (form.destinationAddress.trim().length < 5) errs.destinationAddress = 'Dirección muy corta';
    const w = parseFloat(form.weight);
    if (isNaN(w) || w <= 0) errs.weight = 'Peso inválido';
    const dv = parseFloat(form.declaredValue);
    if (isNaN(dv) || dv < 0) errs.declaredValue = 'Valor inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    try {
      setSubmitting(true);
      await shipmentService.create({
        ...form,
        weight: parseFloat(form.weight),
        declaredValue: parseFloat(form.declaredValue)
      });
      navigate('/cliente');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Error al crear el envío');
    } finally {
      setSubmitting(false);
    }
  }

  const municipalities = form.destinationDepartment ? (LOCATIONS[form.destinationDepartment] || []) : [];

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <div className="breadcrumb">
        Mis envíos / <strong>Nuevo envío</strong>
      </div>
      <h1>Crear nuevo envío</h1>
      <p className="text-muted mb-lg">Completa la información para generar tu guía de envío.</p>

      <form onSubmit={handleSubmit} noValidate className="shipment-form-grid">
        <div className="shipment-main">
          {submitError && <div className="alert alert-error">{submitError}</div>}

          <div className="card section-card">
            <div className="section-num"><span>1</span> Datos del remitente</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" value={user?.fullName || ''} readOnly style={{ background: '#F1F5F9' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" value={user?.phone || ''} readOnly style={{ background: '#F1F5F9' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Dirección de recolección</label>
              <input className="form-input" value={user?.address || ''} readOnly style={{ background: '#F1F5F9' }} />
            </div>
          </div>

          <div className="card section-card">
            <div className="section-num"><span>2</span> Datos del destinatario</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre destinatario</label>
                <input className="form-input" name="recipientName" value={form.recipientName} onChange={handleChange} />
                {errors.recipientName && <div className="form-error">{errors.recipientName}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono destinatario</label>
                <input className="form-input" name="recipientPhone" value={form.recipientPhone} onChange={handleChange} placeholder="5555-1234" />
                {errors.recipientPhone && <div className="form-error">{errors.recipientPhone}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Departamento</label>
                <select className="form-select" name="destinationDepartment" value={form.destinationDepartment} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.destinationDepartment && <div className="form-error">{errors.destinationDepartment}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Municipio</label>
                <select className="form-select" name="destinationMunicipality" value={form.destinationMunicipality} onChange={handleChange} disabled={!form.destinationDepartment}>
                  <option value="">Seleccionar</option>
                  {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.destinationMunicipality && <div className="form-error">{errors.destinationMunicipality}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Dirección de entrega</label>
              <input className="form-input" name="destinationAddress" value={form.destinationAddress} onChange={handleChange} placeholder="Dirección completa, referencias..." />
              {errors.destinationAddress && <div className="form-error">{errors.destinationAddress}</div>}
            </div>
          </div>

          <div className="card section-card">
            <div className="section-num"><span>3</span> Información del paquete</div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-select" name="packageType" value={form.packageType} onChange={handleChange}>
                  {PACKAGE_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Peso (lb)</label>
                <input className="form-input" type="number" min="0.1" step="0.1" name="weight" value={form.weight} onChange={handleChange} />
                {errors.weight && <div className="form-error">{errors.weight}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Valor declarado (Q)</label>
                <input className="form-input" type="number" min="0" step="0.01" name="declaredValue" value={form.declaredValue} onChange={handleChange} />
                {errors.declaredValue && <div className="form-error">{errors.declaredValue}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descripción del contenido</label>
              <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Describe brevemente el contenido del paquete..." />
            </div>
          </div>
        </div>

        <aside className="shipment-aside">
          <div className="cost-card">
            <div className="cost-tag">RESUMEN DEL ENVÍO</div>
            <div className="cost-label">Costo estimado</div>
            <div className="cost-value">
              Q {Math.floor(estimatedCost)}<span>.{(estimatedCost.toFixed(2).split('.')[1] || '00')}</span>
            </div>
            <div className="cost-info">
              <strong>⚡ Entrega estimada</strong>
              <div>2-3 días hábiles</div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 8 }} disabled={submitting}>
              {submitting ? 'Generando...' : 'Generar guía →'}
            </button>
            <button type="button" className="btn btn-ghost-on-dark" onClick={() => navigate('/cliente')}>
              Cancelar
            </button>
          </div>
        </aside>
      </form>

      <style>{`
        .breadcrumb {
          font-size: 11px;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }
        .breadcrumb strong { color: var(--color-primary-dark); font-weight: 500; }
        h1 { font-size: 22px; color: var(--color-primary-dark); font-weight: 600; }
        .shipment-form-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 16px;
        }
        .section-card { margin-bottom: 14px; }
        .section-num {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--color-primary-dark);
          font-weight: 600;
          margin-bottom: 14px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--color-border);
        }
        .section-num span {
          width: 22px; height: 22px;
          background: var(--color-primary-light);
          color: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .form-row .form-group:last-child,
        .form-row-3 .form-group:last-child { margin-bottom: 0; }
        .cost-card {
          background: linear-gradient(135deg, var(--color-primary-dark) 0%, #1E3A8A 100%);
          color: white;
          border-radius: 10px;
          padding: 22px;
          position: sticky;
          top: 80px;
        }
        .cost-tag {
          font-size: 11px;
          opacity: 0.85;
          letter-spacing: 0.6px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .cost-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .cost-value {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 18px;
        }
        .cost-value span { font-size: 22px; }
        .cost-info {
          background: rgba(96, 165, 250, 0.18);
          border: 1px solid rgba(96, 165, 250, 0.4);
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 11px;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .btn-ghost-on-dark {
          width: 100%;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 9px;
          border-radius: 6px;
          font-size: 13px;
          background: transparent;
        }
        .btn-ghost-on-dark:hover { background: rgba(255, 255, 255, 0.1); }
        @media (max-width: 900px) {
          .shipment-form-grid { grid-template-columns: 1fr; }
          .cost-card { position: relative; top: 0; }
          .form-row, .form-row-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
