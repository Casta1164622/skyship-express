import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

// Inicializar Sentry para monitoreo de errores
Sentry.init({
  dsn: "https://bfaedd86565869b00daf01ea4aabb8a4@o4511409078992896.ingest.us.sentry.io/4511409083842560",
  environment: import.meta.env.MODE,
  sendDefaultPii: true,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Ha ocurrido un error. El equipo ya fue notificado.</p>}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);