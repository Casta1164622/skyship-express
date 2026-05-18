# SkyShip Express — Backend

API REST construida con Node.js + Express y MySQL.

## Requisitos previos

- Node.js 18 o superior
- MySQL 8.x (local o remoto)
- npm

## Instalacion paso a paso

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Crear la base de datos

Abre MySQL Workbench, phpMyAdmin o tu cliente preferido, y ejecuta:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p skyship_db < database/seed.sql
```

Esto crea la BD `skyship_db` con las 3 tablas y carga datos de prueba.

### 3. Configurar variables de entorno

Copia el archivo de plantilla:

```bash
cp .env.example .env
```

Edita `.env` con tus datos reales:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_real_de_mysql
DB_NAME=skyship_db
JWT_SECRET=una_cadena_larga_y_aleatoria_aqui
```

> **Importante:** El archivo `.env` esta en `.gitignore`, NUNCA se sube a GitHub. Cada miembro del equipo debe crear el suyo localmente.

### 4. Arrancar el servidor

Modo desarrollo (con auto-reinicio):

```bash
npm run dev
```

Modo produccion:

```bash
npm start
```

El servidor arranca en `http://localhost:4000`.

Para verificar que funciona, abre en el navegador:
`http://localhost:4000/api/health`

Deberias ver: `{"status":"OK","message":"SkyShip API funcionando"}`

## Credenciales de prueba

| Rol     | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@skyship.gt       | admin123    |
| Cliente | juan@correo.com        | cliente123  |
| Cliente | ana@correo.com         | cliente123  |
| Cliente | carlos@correo.com      | cliente123  |

## Estructura del proyecto

```
backend/
├── src/
│   ├── config/         Configuracion (conexion a MySQL)
│   ├── controllers/    Logica de negocio
│   ├── middlewares/    Auth JWT, validacion de roles
│   ├── models/         Acceso a base de datos
│   ├── routes/         Definicion de endpoints
│   ├── utils/          Funciones auxiliares
│   └── app.js          Configuracion de Express
├── database/
│   ├── schema.sql      Crea las tablas
│   └── seed.sql        Datos de prueba
├── .env.example        Plantilla de variables
├── server.js           Punto de entrada
└── package.json
```

## Endpoints disponibles

### Autenticacion (publico)
- `POST /api/auth/register` — Registrar nuevo cliente
- `POST /api/auth/login` — Iniciar sesion
- `GET  /api/auth/me` — Datos del usuario logueado (requiere token)

### Envios (requiere login)
- `GET    /api/shipments` — Listar envios (cliente ve los suyos, admin ve todos)
- `POST   /api/shipments` — Crear envio
- `POST   /api/shipments/estimate` — Calcular costo sin guardar
- `GET    /api/shipments/:id` — Ver un envio
- `PUT    /api/shipments/:id` — Actualizar (solo admin)
- `DELETE /api/shipments/:id` — Eliminar (solo admin)

### Usuarios (solo admin)
- `GET    /api/users` — Listar
- `POST   /api/users` — Crear
- `GET    /api/users/:id` — Ver
- `PUT    /api/users/:id` — Actualizar
- `DELETE /api/users/:id` — Eliminar

### Contacto
- `POST /api/contact` — Enviar mensaje (publico)
- `GET  /api/contact` — Ver mensajes (solo admin)

### Dashboard
- `GET /api/dashboard/stats` — KPIs y graficas (solo admin)

## Arquitectura

Patron **MVC** (Modelo-Vista-Controlador) clasico de Express:

```
Cliente HTTP
    ↓
Routes (define URLs y aplica validaciones)
    ↓
Middlewares (autenticacion, autorizacion)
    ↓
Controllers (logica de negocio)
    ↓
Models (acceso a BD)
    ↓
MySQL
```

## Seguridad

- Contrasenas hasheadas con **bcrypt** (10 salt rounds)
- Autenticacion con **JWT** (expira en 7 dias)
- Validacion de inputs con **express-validator**
- Proteccion de rutas con middlewares de autenticacion y rol
- CORS configurado para aceptar solo el frontend autorizado
