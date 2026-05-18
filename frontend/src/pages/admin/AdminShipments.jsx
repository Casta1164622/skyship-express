/**
 * src/pages/admin/AdminShipments.jsx
 *
 * Listado completo de envios con CRUD para admin.
 * Edicion en modal sobrepuesto.
 */

import { useEffect, useState, useMemo } from 'react';
import { shipmentService } from '../../services/shipmentService';
import { SHIPMENT_STATUS, formatCurrency, formatDate } from '../../utils/locations';

const STATUS_OPTIONS = [
  { value: 'pendiente',   label: 'Pendiente',   color: '#94A3B8' },
  { value: 'en_transito', label: 'En tránsito', color: '#F59E0B' },
  { value: 'entregado',   label: 'Entregado',   color: '#10B981' },
  { value: 'devuelto',    label: 'Devuelto',    color: '#DC2626' }
];

export default function AdminShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function loadShipments() {
    setLoading(true);
    shipmentService.list()
      .then(setShipments)
      .catch(() => setShipments([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadShipments(); }, []);

  const filtered = useMemo(() => {
    return shipments.filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (s.tracking_code || '').toLowerCase().includes(q) ||
               (s.client_name || '').toLowerCase().includes(q) ||
               (s.destination_department || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [shipments, search, statusFilter]);

  async function handleSaveEdit(updated) {
    try {
      await shipmentService.update(editing.id, updated);
      setEditing(null);
      loadShipments();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar');
    }
  }

  async function handleDelete(id) {
    try {
      await shipmentService.remove(id);
      setConfirmDelete(null);
      loadShipments();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Gestión de envíos</h1>
          <p className="text-muted">{shipments.length} envíos en el sistema</p>
        </div>
      </div>

      <div className="card">
        <div className="filters" style={{ marginBottom: 14 }}>
          <input
            className="form-input"
            placeholder="🔍 Buscar por guía, cliente o destino..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos los estados</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p className="text-muted">No hay envíos para mostrar</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guía</th>
                  <th>Cliente</th>
                  <th>Destino</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Costo</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td className="tracking-code">{s.tracking_code}</td>
                    <td>{s.client_name}</td>
                    <td>{s.destination_municipality}, {s.destination_department}</td>
                    <td className="text-muted">{formatDate(s.created_at)}</td>
                    <td>
                      <span className={`badge ${SHIPMENT_STATUS[s.status]?.className}`}>
                        {SHIPMENT_STATUS[s.status]?.label}
                      </span>
                    </td>
                    <td>{formatCurrency(s.cost)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn-icon" onClick={() => setEditing(s)} title="Editar">✎</button>
                        <button className="btn-icon btn-icon-danger" onClick={() => setConfirmDelete(s)} title="Eliminar">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <EditModal
          shipment={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}

      {confirmDelete && (
        <ConfirmDelete
          shipment={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete.id)}
        />
      )}

      <style>{`
        .page-head { margin-bottom: 22px; }
        .page-head h1 { font-size: 22px; color: var(--color-primary-dark); font-weight: 600; }
        .filters {
          display: flex;
          gap: 8px;
        }
        .row-actions {
          display: flex;
          gap: 5px;
          justify-content: flex-end;
        }
        .btn-icon {
          border: 1px solid var(--color-border);
          padding: 4px 8px;
          border-radius: 5px;
          font-size: 13px;
          color: var(--color-text-secondary);
          background: white;
          cursor: pointer;
        }
        .btn-icon:hover { background: var(--color-bg-soft); }
        .btn-icon-danger {
          border-color: #FECACA;
          color: var(--color-danger);
        }
        .btn-icon-danger:hover { background: var(--color-danger-bg); }
        .empty-state { text-align: center; padding: 40px; }
        .empty-icon { font-size: 40px; margin-bottom: 8px; }
      `}</style>
    </div>
  );
}

function EditModal({ shipment, onClose, onSave }) {
  const [form, setForm] = useState({
    recipientName: shipment.recipient_name,
    recipientPhone: shipment.recipient_phone,
    destinationDepartment: shipment.destination_department,
    destinationMunicipality: shipment.destination_municipality,
    destinationAddress: shipment.destination_address,
    status: shipment.status,
    cost: shipment.cost
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ ...form, cost: parseFloat(form.cost) });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-head">
            <div>
              <h2>Editar envío</h2>
              <div className="tracking-code text-muted text-small">{shipment.tracking_code}</div>
            </div>
            <button type="button" className="modal-close" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div className="section-tag">DATOS DEL CLIENTE</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cliente</label>
                <input className="form-input" value={shipment.client_name} readOnly style={{ background: '#F1F5F9' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={shipment.client_email} readOnly style={{ background: '#F1F5F9' }} />
              </div>
            </div>

            <div className="section-tag">DESTINO</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Departamento</label>
                <input className="form-input" name="destinationDepartment" value={form.destinationDepartment} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Municipio</label>
                <input className="form-input" name="destinationMunicipality" value={form.destinationMunicipality} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Destinatario</label>
              <input className="form-input" name="recipientName" value={form.recipientName} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Teléfono destinatario</label>
                <input className="form-input" name="recipientPhone" value={form.recipientPhone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input className="form-input" name="destinationAddress" value={form.destinationAddress} onChange={handleChange} />
              </div>
            </div>

            <div className="section-tag">ESTADO Y COSTO</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Estado del envío</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Costo (Q)</label>
                <input className="form-input" type="number" step="0.01" name="cost" value={form.cost} onChange={handleChange} />
              </div>
            </div>

            <div className="alert alert-info">
              ⚠️ Atención: al cambiar el estado el cliente vera la actualizacion en su panel.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar cambios</button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(11, 30, 63, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 200;
        }
        .modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-head {
          padding: 18px 22px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-head h2 {
          font-size: 16px;
          color: var(--color-primary-dark);
          font-weight: 600;
        }
        .modal-close {
          width: 28px; height: 28px;
          border-radius: 6px;
          background: var(--color-neutral-bg);
          color: var(--color-text-muted);
        }
        .modal-close:hover { background: var(--color-bg-soft); }
        .modal-body { padding: 18px 22px; }
        .section-tag {
          font-size: 10px;
          color: var(--color-primary-light);
          letter-spacing: 0.8px;
          font-weight: 600;
          margin-bottom: 8px;
          margin-top: 14px;
        }
        .section-tag:first-child { margin-top: 0; }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .modal-footer {
          padding: 14px 22px;
          background: var(--color-bg-soft);
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

function ConfirmDelete({ shipment, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-small" onClick={(e) => e.stopPropagation()}>
        <h3>¿Eliminar envío?</h3>
        <p>Vas a eliminar el envío <strong>{shipment.tracking_code}</strong>. Esta acción no se puede deshacer.</p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Sí, eliminar</button>
        </div>

        <style>{`
          .modal-small {
            background: white;
            border-radius: 12px;
            padding: 22px;
            max-width: 380px;
            width: 100%;
          }
          .modal-small h3 {
            color: var(--color-primary-dark);
            margin-bottom: 8px;
          }
          .modal-small p {
            color: var(--color-text-secondary);
            font-size: 13px;
            margin-bottom: 18px;
            line-height: 1.6;
          }
          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }
        `}</style>
      </div>
    </div>
  );
}
