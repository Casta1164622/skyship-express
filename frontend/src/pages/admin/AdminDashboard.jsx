/**
 * src/pages/admin/AdminDashboard.jsx
 *
 * Tablero del admin: KPIs, grafica de barras por mes, dona por region.
 */

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { dashboardService } from '../../services/otherServices';
import { formatCurrency } from '../../utils/locations';

const PIE_COLORS = ['#2563EB', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

function formatMonth(monthString) {
  // monthString viene como "2026-05"
  const [year, month] = monthString.split('-');
  const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return names[parseInt(month, 10) - 1];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getStats()
      .then(setStats)
      .catch((err) => setError(err.response?.data?.error || 'Error al cargar estadísticas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return null;

  const { kpis, byMonth, byRegion } = stats;

  const monthData = (byMonth || []).map(m => ({ month: formatMonth(m.month), total: Number(m.total) }));
  const regionData = (byRegion || []).slice(0, 5).map(r => ({ name: r.region, value: Number(r.total) }));
  const totalRegion = regionData.reduce((acc, r) => acc + r.value, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Panel administrativo</h1>
          <p className="text-muted">Resumen operativo de SkyShip Express</p>
        </div>
      </div>

      <div className="kpis-grid">
        <div className="kpi-card">
          <div className="kpi-head">
            <span>ENVÍOS TOTALES</span>
            <span className="kpi-icon" style={{ background: 'var(--color-primary-bg)' }}>📦</span>
          </div>
          <div className="kpi-value">{kpis.total_shipments || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">
            <span>EN TRÁNSITO</span>
            <span className="kpi-icon" style={{ background: 'var(--color-warning-bg)' }}>🚚</span>
          </div>
          <div className="kpi-value">{kpis.in_transit || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">
            <span>ENTREGADOS</span>
            <span className="kpi-icon" style={{ background: 'var(--color-success-bg)' }}>✓</span>
          </div>
          <div className="kpi-value">{kpis.delivered || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">
            <span>INGRESOS</span>
            <span className="kpi-icon" style={{ background: 'var(--color-success-bg)' }}>💰</span>
          </div>
          <div className="kpi-value">{formatCurrency(kpis.total_revenue || 0)}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h2>Envíos por mes</h2>
          <p className="text-muted text-small">Tendencia de los últimos 6 meses</p>
          <div style={{ height: 280, marginTop: 14 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Envíos por región</h2>
          <p className="text-muted text-small">Top 5 departamentos</p>
          <div style={{ height: 280, marginTop: 14 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {regionData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        .page-head { margin-bottom: 22px; }
        .page-head h1 { font-size: 22px; color: var(--color-primary-dark); font-weight: 600; }
        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        .kpi-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 16px;
        }
        .kpi-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          font-size: 10px;
          color: var(--color-text-muted);
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .kpi-icon {
          width: 28px; height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .kpi-value {
          font-size: 26px;
          color: var(--color-primary-dark);
          font-weight: 700;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 12px;
        }
        .charts-grid h2 {
          font-size: 14px;
          color: var(--color-primary-dark);
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .kpis-grid { grid-template-columns: repeat(2, 1fr); }
          .charts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
