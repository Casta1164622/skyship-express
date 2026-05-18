/**
 * src/pages/admin/AdminContacts.jsx
 *
 * Lista los mensajes enviados desde el formulario de contacto del landing.
 */

import { useEffect, useState } from 'react';
import { contactService } from '../../services/otherServices';
import { formatDate } from '../../utils/locations';

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    contactService.list()
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Mensajes de contacto</h1>
          <p className="text-muted">{messages.length} mensajes recibidos</p>
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : messages.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">✉️</div>
          <h3>No hay mensajes aún</h3>
          <p className="text-muted">Cuando alguien envíe el formulario de contacto, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="contacts-grid">
          <div className="card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Asunto</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(m => (
                    <tr key={m.id} onClick={() => setSelected(m)} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: 500 }}>{m.name}</td>
                      <td className="text-muted">{m.email}</td>
                      <td>{m.subject}</td>
                      <td className="text-muted">{formatDate(m.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{selected.subject}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="text-muted text-small mb-md">
                De: <strong style={{ color: 'var(--color-primary-dark)' }}>{selected.name}</strong> &lt;{selected.email}&gt;
              </p>
              <p className="text-muted text-small mb-lg">{formatDate(selected.created_at)}</p>
              <div style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                {selected.message}
              </div>
            </div>
            <div className="modal-footer">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary">
                Responder por correo
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .page-head { margin-bottom: 22px; }
        .page-head h1 { font-size: 22px; color: var(--color-primary-dark); font-weight: 600; }
        .empty-state { text-align: center; padding: 50px; }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .empty-state h3 { color: var(--color-primary-dark); margin-bottom: 6px; }
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
          max-width: 540px;
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
        .modal-body { padding: 18px 22px; }
        .modal-footer {
          padding: 14px 22px;
          background: var(--color-bg-soft);
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
