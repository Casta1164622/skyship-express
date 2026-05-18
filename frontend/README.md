# SkyShip Express — Frontend

Aplicación web construida con **React 18 + Vite**.

## Requisitos previos

- Node.js 18 o superior
- npm
- El backend de SkyShip corriendo en `http://localhost:4000` (ver `/backend/README.md`)

## Instalación paso a paso

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

Tarda 2-3 minutos. Genera la carpeta `node_modules/`.

### 2. Configurar variables de entorno

Copia el archivo de plantilla:

```bash
copy .env.example .env
```

(En Mac/Linux: `cp .env.example .env`)

El contenido por defecto ya apunta al backend en localhost:

```
VITE_API_URL=http://localhost:4000/api
```

### 3. Arrancar el servidor de desarrollo

```bash
npm run dev
```

Abre en el navegador: **http://localhost:5173**

Se abrirá automáticamente si tu sistema lo permite.

## Credenciales de prueba

| Rol     | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@skyship.gt       | admin123    |
| Cliente | juan@correo.com        | cliente123  |
| Cliente | ana@correo.com         | cliente123  |

## Estructura del proyecto

```
frontend/
├── public/                    Assets estaticos
├── src/
│   ├── components/
│   │   └── common/            Componentes reutilizables (ProtectedRoute)
│   ├── context/
│   │   └── AuthContext.jsx    Estado global de autenticacion
│   ├── layouts/
│   │   ├── PublicLayout.jsx   Header publico
│   │   ├── ClientLayout.jsx   Header del cliente
│   │   └── AdminLayout.jsx    Sidebar admin
│   ├── pages/
│   │   ├── public/            Landing, login, registro, 404
│   │   ├── client/            Dashboard cliente, nuevo envio
│   │   └── admin/             Dashboard, CRUD envios, CRUD usuarios, contactos
│   ├── services/              Llamadas a la API (axios)
│   ├── styles/                Estilos globales
│   ├── utils/                 Utilidades (departamentos, formatters)
│   ├── App.jsx                Definicion de rutas
│   └── main.jsx               Punto de entrada
├── .env.example               Plantilla de variables
├── index.html
├── vite.config.js             Configuracion de Vite
└── package.json
```

## Stack tecnologico

- **React 18** — Framework de UI
- **Vite 5** — Build tool ultrarrapido (reemplaza Create React App)
- **React Router 6** — Navegacion entre paginas
- **Axios** — Cliente HTTP para hablar con el backend
- **Recharts** — Graficas del dashboard admin
- **Context API** — Estado global de autenticacion

## Caracteristicas

- ✅ Diseño responsivo (desktop, tablet, mobile)
- ✅ Autenticacion con JWT, persistencia en localStorage
- ✅ Rutas protegidas por rol (cliente / admin)
- ✅ Interceptor automatico del token en cada peticion
- ✅ Redireccion automatica al login si el token expira
- ✅ Validaciones de formularios en cliente y servidor
- ✅ Calculo de costo de envio en tiempo real
- ✅ Graficas interactivas en el dashboard admin
- ✅ CRUD completo de envios y usuarios

## Scripts disponibles

- `npm run dev` — Servidor de desarrollo con hot reload
- `npm run build` — Genera build de produccion en `dist/`
- `npm run preview` — Sirve el build de produccion para probarlo

## Despliegue

Para producir el build final:

```bash
npm run build
```

Esto genera la carpeta `dist/` con archivos estaticos optimizados.
Luego puedes subir esa carpeta a AWS S3 + CloudFront (ver diagrama de arquitectura).

## Flujo de uso

1. Visitante entra a `/` (landing) → puede llenar el formulario de contacto
2. Visitante se registra en `/registro` → rol automatico: `client`
3. Cliente logueado entra a `/cliente` → ve sus envios
4. Cliente crea envio en `/cliente/nuevo-envio` → se genera codigo SKY-XXXXX
5. Admin logueado entra a `/admin` → ve KPIs y graficas
6. Admin gestiona en `/admin/envios`, `/admin/usuarios`, `/admin/contactos`
