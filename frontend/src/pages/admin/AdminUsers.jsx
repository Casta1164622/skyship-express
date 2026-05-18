/**
 * src/pages/admin/AdminUsers.jsx
 *
 * Listado completo de usuarios con CRUD.
 */

import { useEffect, useState, useMemo } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

const ROLES = [
  { value: 'client', label: 'Cliente' },
  { value: 'admin',  label: 'Admin' }
];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function loadUsers() {
    setLoading(true);
    userService.list()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (u.full_name || '').toLowerCase().includes(q) ||
               (u.email || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, search, roleFilter]);

  async function handleSaveEdit(payload) {
    try {
      await userService.update(editing.id, payload);
      setEditing(null);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al actualizar');
    }
  }

  async function handleCreate(payload) {
    try {
      await userService.create(payload);
      setCreating(false);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al crear');
    }
  }

  async function handleDelete(id) {
    try {
      await userService.remove(id);
      setConfirmDelete(null);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Gestión de usuarios</h1>
          <p className="text-muted">{users.length} usuarios registrados</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>+ Nuevo usuario</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            className="form-input"
            placeholder="🔍 Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">Todos los roles</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td className="text-muted">{String(u.id).padStart(3, '0')}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="user-avatar">{getInitials(u.full_name)}</div>
                        <span style={{ fontWeight: 500 }}>{u.full_name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td className="text-muted">{u.phone}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-client'}`}>
                        {u.role === 'admin' ? 'Admin' : 'Cliente'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => setEditing(u)} title="Editar">✎</button>
                        {u.id !== currentUser.id && (
                          <button className="btn-icon btn-icon-danger" onClick={() => setConfirmDelete(u)} title="Eliminar">🗑</button>
                        )}
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
        <UserModal
          user={editing}
          mode="edit"
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}

      {creating && (
        <UserModal
          mode="create"
          onClose={() => setCreating(false)}
          onSave={handleCreate}
        />
      )}

      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="modal-small" onClick={(e) => e.stopPropagation()}>
            <h3>¿Eliminar usuario?</h3>
            <p>Vas a eliminar a <strong>{confirmDelete.full_name}</strong>. Sus envíos asociados también se eliminarán. Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete.id)}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .page-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }
        .page-head h1 { font-size: 22px; color: var(--color-primary-dark); font-weight: 600; }
        .user-avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: var(--color-primary-bg);
          color: var(--color-primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
        }
        .btn-icon {
          border: 1px solid var(--color-border);
          padding: 4px 8px;
          border-radius: 5px;
          font-size: 13px;
          color: var(--color-text-secondary);
          background: white;
        }
        .btn-icon:hover { background: var(--color-bg-soft); }
        .btn-icon-danger {
          border-color: #FECACA;
          color: var(--color-danger);
        }
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
        .modal-small {
          background: white;
          border-radius: 12px;
          padding: 22px;
          max-width: 400px;
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
      `}</style>
    </div>
  );
}

function UserModal({ user = null, mode, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    role: user?.role || 'client',
    password: ''
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    if (mode === 'edit') delete payload.password;
    onSave(payload);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-head">
            <h2>{mode === 'edit' ? 'Editar usuario' : 'Nuevo usuario'}</h2>
            <button type="button" className="modal-close" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input className="form-input" name="fullName" value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Rol</label>
                <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input className="form-input" name="address" value={form.address} onChange={handleChange} required />
            </div>
            {mode === 'create' && (
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {mode === 'edit' ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
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
        .modal-body { padding: 18px 22px; }
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
