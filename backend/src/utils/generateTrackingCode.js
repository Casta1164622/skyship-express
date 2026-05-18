/**
 * src/utils/generateTrackingCode.js
 *
 * Genera un codigo de guia con el formato SKY-XXXXX
 * basado en el ID numerico del envio que se acaba de insertar.
 *
 * Ejemplo: id 1 -> "SKY-00001", id 247 -> "SKY-00247"
 *
 * Se llama desde shipmentController despues de insertar el envio.
 */

function generateTrackingCode(id) {
  const paddedId = String(id).padStart(5, '0');
  return `SKY-${paddedId}`;
}

/**
 * Calcula el costo estimado del envio segun:
 *   - Departamento destino (capital = mas barato, lejano = mas caro)
 *   - Peso en libras
 *   - Tipo de paquete (sobre / caja chica / mediana / grande)
 *
 * Es una funcion simple para que el sistema sea funcional.
 * En la realidad esto seria mucho mas complejo.
 */
function calculateShippingCost({ department, weight, packageType }) {
  // Tarifa base por zona
  const departmentRates = {
    'Guatemala': 45,
    'Sacatepequez': 50,
    'Chimaltenango': 55,
    'Escuintla': 55,
    'Santa Rosa': 60,
    'Jutiapa': 65,
    'Jalapa': 65,
    'Chiquimula': 70,
    'Zacapa': 70,
    'El Progreso': 60,
    'Izabal': 80,
    'Alta Verapaz': 80,
    'Baja Verapaz': 70,
    'Peten': 95,
    'Quiche': 75,
    'Huehuetenango': 85,
    'San Marcos': 80,
    'Quetzaltenango': 70,
    'Totonicapan': 70,
    'Solola': 65,
    'Suchitepequez': 70,
    'Retalhuleu': 75
  };

  const baseRate = departmentRates[department] || 75;
  const weightCost = Math.max(0, (weight - 1)) * 5; // primer libra gratis, luego Q5 por libra

  const packageMultiplier = {
    'sobre': 0.8,
    'caja_pequena': 1.0,
    'caja_mediana': 1.2,
    'caja_grande': 1.5
  };
  const multiplier = packageMultiplier[packageType] || 1.0;

  const total = (baseRate + weightCost) * multiplier;
  return Math.round(total * 100) / 100; // redondea a 2 decimales
}

module.exports = { generateTrackingCode, calculateShippingCost };
