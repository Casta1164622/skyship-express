/**
 * main.jsx - Punto de entrada de la aplicacion React
 *
 * Aqui hacemos el "mount" de React sobre el div#root del index.html.
 * Envolvemos la app en BrowserRouter para tener navegacion por URL,
 * y en AuthProvider para que cualquier componente pueda saber si hay
 * usuario logueado.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
