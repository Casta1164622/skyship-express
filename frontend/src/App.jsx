/**
 * src/App.jsx
 *
 * Define todas las rutas de la aplicacion y las agrupa por layout.
 * Las rutas protegidas usan el componente ProtectedRoute.
 */

import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Paginas publicas
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';

// Paginas cliente
import ClientDashboard from './pages/client/ClientDashboard';
import NewShipment from './pages/client/NewShipment';

// Paginas admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminShipments from './pages/admin/AdminShipments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContacts from './pages/admin/AdminContacts';

export default function App() {
  return (
    <Routes>
      {/* Rutas publicas con header de marca */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Route>

      {/* Rutas del cliente (requieren login) */}
      <Route
        element={
          <ProtectedRoute requireRole="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/cliente" element={<ClientDashboard />} />
        <Route path="/cliente/nuevo-envio" element={<NewShipment />} />
      </Route>

      {/* Rutas del admin (requieren login + rol admin) */}
      <Route
        element={
          <ProtectedRoute requireRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/envios" element={<AdminShipments />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/contactos" element={<AdminContacts />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
