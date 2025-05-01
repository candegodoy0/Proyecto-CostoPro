// Declaracion de variable para guardar el nombre del producto ingresado por el usuario
let nombreProducto = prompt("Ingrese el nombre del producto (ej: Mesa):");
console.log(` Producto: ${nombreProducto}`);

// Arrays vacios para guardar materiales (gastos variables) y gastos fijos
const materiales = [];
const gastosFijos = [];

/*
- Función para agregar materiales necesarios para fabricar una unidad de producto.
- El usuario puede ingresar uno o mas materiales.
- Cada material tiene un nombre, costo por unidad, cantidad necesaria, y costo total.
*/
function agregarMateriales() {
  let seguir = true;

  while (seguir) {
    let nombre = prompt("Ingrese el nombre del material (ej: Tornillo):");
    let costoUnitario = parseFloat(prompt(`Ingrese el costo por unidad de ${nombre} (ej: 1000.00):`));
    let cantidad = parseFloat(prompt(`Ingrese la cantidad requerida de ${nombre} por unidad de producto:`));

    if (isNaN(costoUnitario) || isNaN(cantidad)) {
      alert("Por favor, ingrese valores numéricos válidos.");
      continue;
    }

     // Se agrega el material al array con los datos necesarios
    materiales.push({
      nombre,
      costoUnitario,
      cantidad,
      costoTotal: costoUnitario * cantidad
    });

    seguir = confirm("¿Quiere agregar otro material?");
  }
}


//Función para ingresar los gastos fijos que no dependen de la cantidad producida. Ejemplo: alquiler, sueldos, etc.//
function agregarGastosFijos() {
  let seguir = true;

  while (seguir) {
    let concepto = prompt("Ingrese el concepto del gasto fijo (ej: Alquiler):");
    let costo = parseFloat(prompt(`Ingrese el costo del gasto fijo ${concepto}(ej: 1000.00):`));

    if (isNaN(costo)) {
      alert("Por favor, ingrese un valor numérico válido.");
      continue;
    }

     // Se agrega el gasto fijo al array
    gastosFijos.push({ concepto, costo });
    seguir = confirm("Quiere agregar otro gasto fijo?");
  }
}

/*
Función para realizar todos los cálculos del simuador:
- Primero valida que haya agregado correctamente materiales y gastos fijos.
- Se le pide al usuario el porcentaje de ganancia y cantidad a producir
- Se calcula el costo total de materiales, gastos fijos, y costos totales finales de producion
- Se muestra un resumen de todos los costos
*/

function calcularCostos() {
  if (materiales.length === 0 || gastosFijos.length === 0) {
    alert("Debe ingresar al menos un material y un gasto fijo antes de calcular.");
    return;
  }

  let gananciaPorcentual = parseFloat(prompt("Ingrese el porcentaje de ganancia que desee (ej: 25%):"));
  let cantidadProduccion = parseInt(prompt("Ingrese la cantidad total a producir (ej: 200):"));

  if (isNaN(cantidadProduccion) || isNaN(gananciaPorcentual) || cantidadProduccion <= 0) {
    alert("Cantidad o ganancia ingresadas inválidas.");
    return;
  }

  // Calcular total de gastos variables por unidad
let totalVariablesUnitarios = 0;
for (let i = 0; i < materiales.length; i++) {
  totalVariablesUnitarios += materiales[i].costoTotal;
}

  // Total de variables para toda la producción
let totalVariables = totalVariablesUnitarios * cantidadProduccion;

// Calcular total de gastos fijos
let totalFijos = 0;
for (let i = 0; i < gastosFijos.length; i++) {
  totalFijos += gastosFijos[i].costo;
}

// Costo total de produccion
let costoTotal = totalVariables + totalFijos;

//Costo total por unidad sin ganancia
let costoPorUnidad = costoTotal / cantidadProduccion;

  // Costo por unidad con ganancia incluida
let costoConGanancia = costoPorUnidad * (1 + gananciaPorcentual / 100);

  // Mostrar resultados
  alert("CÁLCULO FINALIZADO. Consulta aquí para ver el detalle.");

  console.log("-----RESUMEN DE COSTOS-----");
  console.log("Cantidad a producir:", cantidadProduccion);

 console.log("Materiales:");
for (let i = 0; i < materiales.length; i++) {
  let mat = materiales[i];
  console.log(mat.nombre + ": $" + mat.costoUnitario + " x " + mat.cantidad + " = $" + mat.costoTotal);
}
console.log("Total de gastos variables por unidad: $" + totalVariablesUnitarios);
console.log("Total de gastos variables (x" + cantidadProduccion + "): $" + totalVariables);

console.log("Gastos fijos:");
for (let i = 0; i < gastosFijos.length; i++) {
  let gasto = gastosFijos[i];
  console.log(gasto.concepto + ": $" + gasto.costo);
}
console.log("Total de gastos fijos: $" + totalFijos);


  console.log("--- Totales ---");

  console.log("Costo total de producción: $" + costoTotal);
  console.log("Costo por unidad sin ganancia: $" + costoPorUnidad);
  console.log("Costo por unidad con ganancia: $" + costoConGanancia);
  
}

/*
Función principal que inicia todo el proceso del simulador
Se llama a todas las funciones en orden: 1. materiales, 2. gastos fijos 3. cálculos de costos
*/

function iniciarCalculadora() {
  alert("Bienvenido a CostoPro - Simulador- Calculadora de Costos de Producción");

  agregarMateriales();
  agregarGastosFijos();
  calcularCostos();

  alert("Gracias por usar la calculadora de CostoPro.");
}

//ejecutar el programa
iniciarCalculadora();
