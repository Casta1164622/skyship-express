/**
 * src/pages/client/ClientDashboard.jsx
 *
 * Listado de los envios del cliente logueado, con stats y filtros.
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { shipmentService } from '../../services/shipmentService';
import { SHIPMENT_STATUS, formatCurrency, formatDate } from '../../utils/locations';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    shipmentService.list()
      .then(setShipments)
      .catch(() => setShipments([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: shipments.length,
    transit: shipments.filter(s => s.status === 'en_transito').length,
    delivered: shipments.filter(s => s.status === 'entregado').length,
    pending: shipments.filter(s => s.status === 'pendiente').length
  }), [shipments]);

  const filtered = useMemo(() => {
    return shipments.filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (s.tracking_code || '').toLowerCase().includes(q) ||
               (s.destination_department || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [shipments, search, statusFilter]);

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <div className="page-head">
        <div>
          <h1>Hola, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p className="text-muted">Aquí está el resumen de todos tus envíos</p>
        </div>
        <Link to="/cliente/nuevo-envio" className="btn btn-primary">+ Nuevo envío</Link>
      </div>

      <div className="kpis-grid">
        <div className="kpi-card">
          <div className="kpi-label">TOTAL ENVÍOS</div>
          <div className="kpi-value">{stats.total}</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid var(--color-warning)' }}>
          <div className="kpi-label">EN TRÁNSITO</div>
          <div className="kpi-value">{stats.transit}</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid var(--color-success)' }}>
          <div className="kpi-label">ENTREGADOS</div>
          <div className="kpi-value">{stats.delivered}</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid var(--color-text-light)' }}>
          <div className="kpi-label">PENDIENTES</div>
          <div className="kpi-value">{stats.pending}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="card-head">
          <h2>Listado de envíos</h2>
          <div className="filters">
            <input
              className="form-input filter-search"
              placeholder="🔍 Buscar guía..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_transito">En tránsito</option>
              <option value="entregado">Entregado</option>
              <option value="devuelto">Devuelto</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No hay envíos para mostrar</h3>
            <p className="text-muted">{shipments.length === 0 ? 'Crea tu primer envío' : 'Prueba con otros filtros'}</p>
            {shipments.length === 0 && (
              <Link to="/cliente/nuevo-envio" className="btn btn-primary" style={{ marginTop: 12 }}>
                Crear envío
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código guía</th>
                  <th>Destino</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Costo</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td className="tracking-code">{s.tracking_code}</td>
                    <td>{s.destination_municipality}, {s.destination_department}</td>
                    <td className="text-muted">{formatDate(s.created_at)}</td>
                    <td>
                      <span className={`badge ${SHIPMENT_STATUS[s.status]?.className}`}>
                        {SHIPMENT_STATUS[s.status]?.label}
                      </span>
                    </td>
                    <td>{formatCurrency(s.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .page-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }
        .page-head h1 { font-size: 22px; color: var(--color-primary-dark); font-weight: 600; }
        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .kpi-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 16px;
        }
        .kpi-label {
          font-size: 10px;
          color: var(--color-text-muted);
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .kpi-value {
          font-size: 26px;
          color: var(--color-primary-dark);
          font-weight: 700;
          margin-top: 4px;
        }
        .card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .card-head h2 {
          font-size: 16px;
          color: var(--color-primary-dark);
          font-weight: 600;
        }
        .filters {
          display: flex;
          gap: 8px;
        }
        .filter-search { width: 220px; }
        .empty-state {
          text-align: center;
          padding: 50px 20px;
        }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .empty-state h3 {
          font-size: 16px;
          color: var(--color-primary-dark);
          margin-bottom: 4px;
        }
        @media (max-width: 768px) {
          .kpis-grid { grid-template-columns: repeat(2, 1fr); }
          .filter-search { width: 100%; }
        }
      `}</style>
    </div>
  );
}
