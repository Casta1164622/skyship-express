# SkyShip Express

🌐 **Aplicación desplegada**: http://skyship-express-frontend-tucasta.s3-website-us-east-1.amazonaws.com
🔌 **API en producción**: http://98.93.86.45:4000/api

---

## Equipo de desarrollo

| Nombre | Carné |
|--------|-------|
|[Sebastian Castañeda] | [1164622]|
|[Cesar Mejia]| [1127922]|


---

## Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| **Administrador** | `admin@skyship.gt` | `admin123` |
| Cliente | `juan@correo.com` | `cliente123` |
| Cliente | `ana@correo.com` | `cliente123` |
| Cliente | `carlos@correo.com` | `cliente123` |

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 18 + Vite 5 + React Router 6 |
| **Backend** | Node.js 20 + Express 4 |
| **Base de datos** | MySQL 8 (relacional) |
| **Autenticación** | JWT + bcrypt |
| **Despliegue Frontend** | Amazon S3 (sitio estático) |
| **Despliegue Backend** | Amazon EC2 (Ubuntu 22.04) con PM2 |
| **Base de datos en la nube** | Amazon RDS MySQL |
| **Monitoreo de errores** | Sentry (Lab 10) |

---

## Estructura del repositorio

```
skyship-express/
├── backend/                 API REST con Node + Express
│   ├── src/
│   │   ├── config/          Conexión a MySQL
│   │   ├── controllers/     Lógica de negocio
│   │   ├── middlewares/     Auth JWT y validación de roles
│   │   ├── models/          Acceso a base de datos
│   │   ├── routes/          Endpoints
│   │   ├── utils/           Helpers (códigos de guía, cálculo de costos)
│   │   └── app.js           Configuración Express
│   ├── database/
│   │   ├── schema.sql       Estructura de las tablas
│   │   └── seed.sql         Datos de prueba
│   ├── server.js
│   └── package.json
│
├── frontend/                Aplicación React
│   ├── src/
│   │   ├── components/      Componentes reutilizables
│   │   ├── context/         Context API (autenticación)
│   │   ├── layouts/         Layouts por tipo de usuario
│   │   ├── pages/           Páginas (public, client, admin)
│   │   ├── services/        Llamadas a la API (Axios)
│   │   ├── styles/          Estilos globales
│   │   ├── utils/           Utilidades (departamentos, formatters)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## Cómo ejecutar el proyecto localmente

### Requisitos previos

- Node.js 18 o superior
- MySQL 8 instalado localmente
- npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/Casta1164622/skyship-express.git
cd skyship-express
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear la base de datos con MySQL Workbench (o desde terminal):

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p skyship_db < database/seed.sql
```

Crear el archivo `.env` en `backend/` (copiar desde `.env.example`) y completar:

```
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=skyship_db

JWT_SECRET=clave_secreta_skyship_express_2026
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
```

Arrancar el servidor de desarrollo:

```bash
npm run dev
```

El backend quedará escuchando en `http://localhost:4000`.

### 3. Configurar el frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crear el archivo `.env` en `frontend/` (copiar desde `.env.example`):

```
VITE_API_URL=http://localhost:4000/api
```

Arrancar el servidor de desarrollo:

```bash
npm run dev
```

El frontend abrirá automáticamente en `http://localhost:5173`.

---

## Funcionalidades implementadas

### Landing público (requisito 1)
- ✅ Hero con propuesta de valor
- ✅ Resumen de servicios de la empresa
- ✅ Historia, misión, visión y valores
- ✅ FAQ interactivo
- ✅ Formulario de contacto con validaciones (guardado en BD)
- ✅ Diseño responsivo

### Autenticación (requisito 2)
- ✅ Registro con nombre, correo, teléfono, dirección y contraseña
- ✅ Login con validación de credenciales
- ✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
- ✅ Sesión persistida con JWT

### Envíos (requisito 3)
- ✅ Cliente autenticado visualiza listado de sus envíos
- ✅ Creación de envíos con cálculo de costo en tiempo real
- ✅ Código de guía autogenerado (formato `SKY-XXXXX`)
- ✅ Destino, fecha de creación, estado y costo estimado

### Panel administrativo (requisito 4)
- ✅ Usuario administrador pre-creado
- ✅ CRUD completo de usuarios
- ✅ CRUD completo de envíos
- ✅ Dashboard con KPIs y gráficas:
  - Envíos por mes (gráfica de barras)
  - Envíos por región (gráfica de dona)
  - Total de envíos, en tránsito, entregados, ingresos
- ✅ Gestión de mensajes de contacto recibidos

### Backend y persistencia (requisito 5)
- ✅ MySQL como base de datos relacional (3 tablas con foreign keys)
- ✅ Protección de rutas con middleware JWT
- ✅ Middleware de verificación de roles (`admin` / `client`)
- ✅ Validación de inputs con `express-validator`

---

## Arquitectura

### Lógica (3-tier)

```
┌────────────────────────────────────────────┐
│  Frontend (React)                          │
│  - Páginas públicas, cliente y admin       │
│  - Context API para estado de auth         │
│  - Axios con interceptor de JWT            │
└──────────────┬─────────────────────────────┘
               │ HTTP / REST + JWT
┌──────────────▼─────────────────────────────┐
│  Backend (Node + Express)                  │
│  - Routes → Middlewares → Controllers      │
│  - Modelos para acceso a BD                │
│  - JWT, bcrypt, express-validator          │
└──────────────┬─────────────────────────────┘
               │ SQL queries (mysql2)
┌──────────────▼─────────────────────────────┐
│  MySQL                                     │
│  - users (clientes + admin)                │
│  - shipments (envíos)                      │
│  - contact_messages                        │
└────────────────────────────────────────────┘
```

### Despliegue en AWS

```
Internet
    ↓
Amazon S3 (frontend estático) ────┐
                                  │
                                  ↓
                        Amazon EC2 (backend Node)
                                  ↓
                        Amazon RDS (MySQL)
```

---

## Decisiones técnicas relevantes

### Frontend

- **Vite en lugar de Create React App**: Vite es significativamente más rápido (build de producción 10x más veloz) y es el estándar actual recomendado por la comunidad de React.
- **Context API en lugar de Redux**: Para este alcance, Context API es suficiente para manejar el estado global de autenticación sin agregar complejidad innecesaria.
- **Axios con interceptors**: Se configuró un interceptor que añade automáticamente el token JWT en cada petición autenticada y otro que detecta tokens expirados (HTTP 401) para redirigir al login.
- **CSS-in-JS inline con variables CSS**: Se evitó instalar Tailwind para mantener el proyecto autocontenido. Las variables CSS permiten un theming consistente.
- **Recharts**: Librería de gráficas declarativa para React, usada en el dashboard del admin.

### Backend

- **Arquitectura MVC**: Separación clara en rutas → middlewares → controllers → models. Esto permite cambiar la BD o el framework con cambios mínimos.
- **mysql2 con pool de conexiones**: En vez de abrir/cerrar conexión en cada query, se mantiene un pool de 10 conexiones reutilizables.
- **JWT en lugar de sesiones server-side**: Permite que el backend sea stateless (sin guardar sesiones), lo que facilita escalar horizontalmente.
- **bcrypt con 10 salt rounds**: Balance recomendado entre seguridad y velocidad para hashing de contraseñas.
- **PM2 como process manager**: En producción mantiene el proceso de Node corriendo automáticamente y lo reinicia si falla.

### Base de datos

- **MySQL relacional**: Los datos del dominio están altamente relacionados (un usuario tiene muchos envíos), lo que hace natural el uso de un modelo relacional con foreign keys e índices.
- **ENUM para estados y roles**: Garantiza integridad de datos sin necesidad de tablas adicionales.
- **Índices estratégicos**: En `email` (búsqueda en login), `tracking_code` (búsqueda por guía), `user_id` (listado por cliente) y `created_at` (ordenamiento).

### Despliegue

- **S3 para el frontend**: Los archivos estáticos generados por Vite no requieren un servidor con CPU; S3 los sirve directamente, lo cual es más barato y más rápido que usar EC2.
- **EC2 t2.micro para el backend**: Suficiente para una API académica. Free Tier de AWS otorga 750 horas/mes durante el primer año.
- **RDS db.t3.micro**: Base de datos administrada por AWS (backups, parches y mantenimiento automáticos). También dentro del Free Tier.
- **Security Groups**: El RDS solo acepta conexiones desde el Security Group del EC2 y desde la IP del desarrollador para mantenimiento. El EC2 expone solo los puertos 22 (SSH), 80 (HTTP) y 4000 (API).

---

## Seguridad implementada

- 🔒 Contraseñas hasheadas con bcrypt
- 🔒 Autenticación con JWT (expiración 7 días)
- 🔒 Validación de inputs con `express-validator` en cada endpoint
- 🔒 Middleware de protección de rutas
- 🔒 Middleware de verificación de rol para acciones de administrador
- 🔒 Variables sensibles (passwords, secrets) en `.env` (nunca en el repositorio)
- 🔒 CORS configurado para aceptar solo el frontend autorizado
- 🔒 Security Groups en AWS para restringir acceso a la base de datos

---

## Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/register` | Público | Registrar cliente nuevo |
| POST | `/login` | Público | Iniciar sesión |
| GET | `/me` | JWT | Datos del usuario logueado |

### Envíos (`/api/shipments`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/` | JWT | Listar envíos (cliente: los suyos / admin: todos) |
| POST | `/` | JWT | Crear envío |
| POST | `/estimate` | JWT | Calcular costo sin guardar |
| GET | `/:id` | JWT | Ver detalle |
| PUT | `/:id` | JWT + Admin | Actualizar |
| DELETE | `/:id` | JWT + Admin | Eliminar |

### Usuarios (`/api/users`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/` | JWT + Admin | Listar usuarios |
| POST | `/` | JWT + Admin | Crear usuario |
| GET | `/:id` | JWT + Admin | Ver usuario |
| PUT | `/:id` | JWT + Admin | Actualizar |
| DELETE | `/:id` | JWT + Admin | Eliminar |

### Contacto (`/api/contact`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/` | Público | Enviar mensaje |
| GET | `/` | JWT + Admin | Ver mensajes |

### Dashboard (`/api/dashboard`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/stats` | JWT + Admin | KPIs y datos para gráficas |

### Salud

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/health` | Público | Verificar que la API responde |

---

## Capturas de pantalla

_(Agrega aquí capturas de tu aplicación corriendo si quieres)_

---

## Licencia

Proyecto académico desarrollado únicamente con fines educativos para la Universidad Rafael Landívar.
