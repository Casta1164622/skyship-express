/**
 * src/utils/locations.js
 *
 * Lista de departamentos y municipios de Guatemala para los selectores.
 * Solo incluimos los municipios mas importantes para no saturar.
 */

export const LOCATIONS = {
  'Guatemala': ['Guatemala', 'Mixco', 'Villa Nueva', 'Villa Canales', 'San Miguel Petapa', 'Amatitlán', 'Chinautla'],
  'Sacatepequez': ['Antigua Guatemala', 'Jocotenango', 'Ciudad Vieja', 'San Lucas Sacatepéquez'],
  'Chimaltenango': ['Chimaltenango', 'San Martín Jilotepeque', 'Tecpán Guatemala', 'Patzún'],
  'Escuintla': ['Escuintla', 'Puerto San José', 'Tiquisate', 'Santa Lucía Cotzumalguapa'],
  'Santa Rosa': ['Cuilapa', 'Barberena', 'Chiquimulilla'],
  'Solola': ['Sololá', 'Panajachel', 'Santiago Atitlán'],
  'Totonicapan': ['Totonicapán', 'San Cristóbal Totonicapán'],
  'Quetzaltenango': ['Quetzaltenango', 'Coatepeque', 'Salcajá', 'Almolonga'],
  'Suchitepequez': ['Mazatenango', 'San Antonio Suchitepéquez'],
  'Retalhuleu': ['Retalhuleu', 'Champerico'],
  'San Marcos': ['San Marcos', 'Malacatán', 'Tacaná'],
  'Huehuetenango': ['Huehuetenango', 'Chiantla', 'La Democracia'],
  'Quiche': ['Santa Cruz del Quiché', 'Chichicastenango', 'Nebaj'],
  'Baja Verapaz': ['Salamá', 'Rabinal'],
  'Alta Verapaz': ['Cobán', 'San Pedro Carchá', 'Senahú', 'Tactic'],
  'Peten': ['Flores', 'San Benito', 'Sayaxché', 'Poptún'],
  'Izabal': ['Puerto Barrios', 'Livingston', 'Morales'],
  'Zacapa': ['Zacapa', 'Gualán', 'Río Hondo'],
  'Chiquimula': ['Chiquimula', 'Esquipulas', 'Concepción Las Minas'],
  'Jalapa': ['Jalapa', 'Mataquescuintla'],
  'Jutiapa': ['Jutiapa', 'Asunción Mita'],
  'El Progreso': ['Guastatoya', 'Sanarate']
};

export const DEPARTMENTS = Object.keys(LOCATIONS);

export const PACKAGE_TYPES = [
  { value: 'sobre',          label: 'Sobre / Documentos' },
  { value: 'caja_pequena',   label: 'Caja pequeña (hasta 5 lb)' },
  { value: 'caja_mediana',   label: 'Caja mediana (hasta 15 lb)' },
  { value: 'caja_grande',    label: 'Caja grande (hasta 50 lb)' }
];

export const SHIPMENT_STATUS = {
  pendiente: { label: 'Pendiente', className: 'badge-pending' },
  en_transito: { label: 'En tránsito', className: 'badge-transit' },
  entregado: { label: 'Entregado', className: 'badge-delivered' },
  devuelto: { label: 'Devuelto', className: 'badge-returned' }
};

export function formatCurrency(value) {
  return `Q ${Number(value).toFixed(2)}`;
}

export function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
