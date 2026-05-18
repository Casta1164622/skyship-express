-- ============================================================
-- SkyShip Express - Esquema de base de datos
-- ============================================================
-- Ejecutar este script en MySQL Workbench, phpMyAdmin o desde
-- la linea de comandos:
--    mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS skyship_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE skyship_db;

-- ============================================================
-- Tabla: users
-- ============================================================
-- Almacena tanto clientes como administradores.
-- El rol diferencia los permisos.
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(150) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  phone           VARCHAR(20)  NOT NULL,
  address         VARCHAR(255) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('client', 'admin') NOT NULL DEFAULT 'client',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ============================================================
-- Tabla: shipments
-- ============================================================
-- Cada envio pertenece a un usuario (relacion 1:N).
-- El tracking_code es el codigo de guia visible (SKY-00001).
-- El status sigue el ciclo: pendiente -> en_transito -> entregado
--                                                  -> devuelto
-- ============================================================
CREATE TABLE IF NOT EXISTS shipments (
  id                        INT AUTO_INCREMENT PRIMARY KEY,
  tracking_code             VARCHAR(20) UNIQUE,
  user_id                   INT NOT NULL,
  recipient_name            VARCHAR(150) NOT NULL,
  recipient_phone           VARCHAR(20)  NOT NULL,
  destination_department    VARCHAR(80)  NOT NULL,
  destination_municipality  VARCHAR(80)  NOT NULL,
  destination_address       VARCHAR(255) NOT NULL,
  package_type              ENUM('sobre', 'caja_pequena', 'caja_mediana', 'caja_grande') NOT NULL,
  weight_lb                 DECIMAL(8,2) NOT NULL,
  declared_value            DECIMAL(10,2) DEFAULT 0,
  description               TEXT,
  status                    ENUM('pendiente', 'en_transito', 'entregado', 'devuelto') NOT NULL DEFAULT 'pendiente',
  cost                      DECIMAL(10,2) NOT NULL,
  created_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_tracking (tracking_code),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at),
  INDEX idx_department (destination_department)
);

-- ============================================================
-- Tabla: contact_messages
-- ============================================================
-- Mensajes enviados desde el formulario de contacto del landing.
-- No requieren cuenta, asi que no hay relacion con users.
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  subject     VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at)
);
