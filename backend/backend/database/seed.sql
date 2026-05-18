-- ============================================================
-- SkyShip Express - Datos de prueba (seed)
-- ============================================================
-- Ejecutar DESPUES de schema.sql:
--    mysql -u root -p skyship_db < seed.sql
-- ============================================================
-- Credenciales de prueba:
--   ADMIN:    admin@skyship.gt    /  admin123
--   CLIENTE:  juan@correo.com     /  cliente123
--   CLIENTE:  ana@correo.com      /  cliente123
--   CLIENTE:  carlos@correo.com   /  cliente123
-- ============================================================

USE skyship_db;

-- Limpiamos antes de insertar (idempotente para volver a correr)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE shipments;
TRUNCATE TABLE contact_messages;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ===== USUARIOS =====
-- Las contrasenas estan hasheadas con bcrypt (10 vueltas)
INSERT INTO users (id, full_name, email, phone, address, password_hash, role) VALUES
(1, 'Admin Root',           'admin@skyship.gt',  '5555-0000', 'Oficinas Centrales SkyShip, Zona 10', '$2b$10$f281eq/IaVj0LE8WostT9usu/YVwLxwHKh1hxsrzNHErgHnQxIUnq', 'admin'),
(2, 'Juan Perez Garcia',    'juan@correo.com',   '5555-1111', 'Zona 1, Ciudad de Guatemala',         '$2b$10$0tCXY4NAae/fMzH35BhL5ux3DHxB9bppaaBKi4kQAG7oYx7CexxIq', 'client'),
(3, 'Ana Lopez Mendez',     'ana@correo.com',    '5555-2222', 'Zona 10, Ciudad de Guatemala',        '$2b$10$0tCXY4NAae/fMzH35BhL5ux3DHxB9bppaaBKi4kQAG7oYx7CexxIq', 'client'),
(4, 'Carlos Mendez Ruiz',   'carlos@correo.com', '5555-3333', 'Mixco, Guatemala',                    '$2b$10$0tCXY4NAae/fMzH35BhL5ux3DHxB9bppaaBKi4kQAG7oYx7CexxIq', 'client'),
(5, 'Luisa Ramirez',        'luisa@correo.com',  '5555-4444', 'Villa Nueva, Guatemala',              '$2b$10$0tCXY4NAae/fMzH35BhL5ux3DHxB9bppaaBKi4kQAG7oYx7CexxIq', 'client'),
(6, 'Pedro Castillo',       'pedro@correo.com',  '5555-5555', 'Quetzaltenango Centro',               '$2b$10$0tCXY4NAae/fMzH35BhL5ux3DHxB9bppaaBKi4kQAG7oYx7CexxIq', 'client'),
(7, 'Sofia Gutierrez',      'sofia@correo.com',  '5555-6666', 'Antigua Guatemala, Sacatepequez',     '$2b$10$0tCXY4NAae/fMzH35BhL5ux3DHxB9bppaaBKi4kQAG7oYx7CexxIq', 'client');

-- ===== ENVIOS =====
-- Variedad de fechas, estados y regiones para que el dashboard tenga graficas con datos
INSERT INTO shipments (tracking_code, user_id, recipient_name, recipient_phone, destination_department, destination_municipality, destination_address, package_type, weight_lb, declared_value, description, status, cost, created_at) VALUES
('SKY-00001', 2, 'Maria Lopez',     '5555-1001', 'Quetzaltenango', 'Quetzaltenango', 'Zona 1, 4ta calle 5-23',          'caja_mediana', 5.0,  500.00, 'Ropa y zapatos',         'entregado',   75.00, DATE_SUB(NOW(), INTERVAL 5 MONTH)),
('SKY-00002', 3, 'Roberto Diaz',    '5555-1002', 'Sacatepequez',    'Antigua Guatemala', 'Calle del Arco 12',           'sobre',        0.5,  50.00,  'Documentos legales',     'entregado',   40.00, DATE_SUB(NOW(), INTERVAL 5 MONTH)),
('SKY-00003', 4, 'Marcos Quintero', '5555-1003', 'Alta Verapaz',    'Coban',             'Barrio San Marcos 4ta av',    'caja_grande',  12.0, 1200.00,'Electrodomestico',        'entregado',   126.00, DATE_SUB(NOW(), INTERVAL 4 MONTH)),
('SKY-00004', 2, 'Carla Vasquez',   '5555-1004', 'Escuintla',        'Escuintla',         'Colonia Brisas del Mar',       'caja_pequena', 2.0,  150.00, 'Libros',                  'entregado',   60.00, DATE_SUB(NOW(), INTERVAL 4 MONTH)),
('SKY-00005', 5, 'Andres Solis',    '5555-1005', 'Huehuetenango',   'Huehuetenango',     'Centro, 2da avenida',          'caja_mediana', 4.5,  300.00, 'Ropa infantil',           'devuelto',    102.00, DATE_SUB(NOW(), INTERVAL 3 MONTH)),
('SKY-00006', 3, 'Diana Morales',   '5555-1006', 'Peten',            'Flores',             'Isla de Flores, frente al lago','caja_pequena', 3.0, 200.00, 'Articulos artesanales',   'entregado',   105.00, DATE_SUB(NOW(), INTERVAL 3 MONTH)),
('SKY-00007', 6, 'Patricia Soto',   '5555-1007', 'Chiquimula',      'Chiquimula',         'Centro de Chiquimula',         'caja_mediana', 6.0,  400.00, 'Productos varios',        'en_transito', 96.00, DATE_SUB(NOW(), INTERVAL 2 MONTH)),
('SKY-00008', 2, 'Esteban Reyes',   '5555-1008', 'Huehuetenango',   'Huehuetenango',     'Aldea Chiantla, casa esquinera','caja_grande', 10.0, 800.00, 'Equipo deportivo',         'devuelto',    172.50, DATE_SUB(NOW(), INTERVAL 2 MONTH)),
('SKY-00009', 7, 'Mariana Cruz',    '5555-1009', 'Escuintla',        'Puerto San Jose',   'Frente al malecon',            'sobre',        0.5,  100.00, 'Tarjetas postales',       'entregado',   44.00, DATE_SUB(NOW(), INTERVAL 1 MONTH)),
('SKY-00010', 4, 'Hector Jimenez',  '5555-1010', 'Alta Verapaz',    'Coban',             'Barrio La Esperanza',          'caja_grande',  15.0, 1500.00,'Equipo de oficina',       'pendiente',   180.00, DATE_SUB(NOW(), INTERVAL 1 MONTH)),
('SKY-00011', 3, 'Roberto Diaz',    '5555-1002', 'Sacatepequez',    'Antigua Guatemala', 'Calle del Arco 12',           'caja_pequena', 2.0,  150.00, 'Regalo de cumpleanos',    'entregado',   55.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('SKY-00012', 2, 'Maria Lopez',     '5555-1001', 'Quetzaltenango', 'Quetzaltenango', 'Zona 1, 4ta calle 5-23',          'caja_mediana', 5.0,  500.00, 'Pedido mensual',          'en_transito', 84.00, DATE_SUB(NOW(), INTERVAL 4 DAY)),
('SKY-00013', 5, 'Sandra Aguilar',  '5555-1011', 'Solola',           'Panajachel',        'Calle Santander',              'caja_pequena', 1.5,  80.00,  'Articulos de cocina',     'en_transito', 78.00, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('SKY-00014', 6, 'Daniel Herrera',  '5555-1012', 'Izabal',           'Puerto Barrios',    'Centro, frente al muelle',     'caja_grande',  8.0,  600.00, 'Material de construccion','pendiente',   141.00, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('SKY-00015', 7, 'Lorena Vargas',   '5555-1013', 'Guatemala',        'Mixco',              'Colonia El Naranjo',            'sobre',        0.3,  20.00,  'Documentos urgentes',     'entregado',   36.00, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('SKY-00016', 2, 'Carlos Estrada',  '5555-1014', 'Guatemala',        'Villa Nueva',        'Zona 5, Bulevar el Frutal',     'caja_mediana', 4.0,  350.00, 'Ropa de invierno',        'pendiente',   69.00, NOW());

-- ===== MENSAJES DE CONTACTO =====
INSERT INTO contact_messages (name, email, subject, message) VALUES
('Carlos Rivera',  'crivera@empresa.com', 'Cotizacion empresarial',  'Buenas, necesito cotizar envios mensuales para mi empresa, somos un comercio electronico mediano.'),
('Ana Maria Soto', 'amsoto@gmail.com',    'Pregunta sobre cobertura','Quisiera saber si tienen cobertura en San Marcos. Hago envios frecuentes a esa zona.'),
('Luis Ortega',    'lortega@correo.com',  'Reclamo de envio',         'Mi envio SKY-00005 fue devuelto y no me han contactado, agradeceria informacion.');
