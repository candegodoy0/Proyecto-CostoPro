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
    let costoUnitario = parseFloat(prompt(`Ingrese el costo por unidad de ${nombre} (ej: $1000.00):`));
    let cantidad = parseFloat(prompt(`Ingrese la cantidad requerida de ${nombre} por unidad de producto (ej: 150):`));
    let unidad = prompt(`Ingrese la unidad de medida para ${nombre} (ej: litros, metros, cajas):`);
    let unidadesPorSeleccionada = parseFloat(prompt(`Ingrese cantidad de unidades estándar hay por cada ${unidad} (ej: 12 si una caja tiene 12 unidades):`));

    if (isNaN(costoUnitario) 
      || isNaN(cantidad) ||
    isNaN(unidadesPorSeleccionada) ||
    unidadesPorSeleccionada <= 0
  ) {
      alert("Por favor, ingrese valores numéricos válidos.");
      continue;
    }

     // Se agrega el material al array con los datos necesarios
    materiales.push({
      nombre,
      costoUnitario,
      cantidad,
      unidad,
      unidadesPorSeleccionada,
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
    let costo = parseFloat(prompt(`Ingrese el costo del gasto fijo ${concepto} (ej: 1000.00):`));

    if (isNaN(costo)) {
      alert("Por favor, ingrese un valor numérico válido.");
      continue;
    }

     // Se agrega el gasto fijo al array
    gastosFijos.push({ concepto, costo });
    seguir = confirm("¿Quiere agregar otro gasto fijo?");
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
  function calcularCostoMateriales(materiales) {
let totalVariablesUnitarios = 0;
for (let i = 0; i < materiales.length; i++) {
  totalVariablesUnitarios += materiales[i].costoTotal;
}
return totalVariablesUnitarios;
  }

  // Llamar a la funcion y usar el resultado
  let totalVariablesUnitarios = calcularCostoMateriales(materiales);
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

// Mensaje para mostrar al usuario de manera inmediata los resultados de los calculos 
let mensaje = "CÁLCULO FINALIZADO\n";
mensaje += "Producto: " + nombreProducto + "\n"; 
mensaje += "Cantidad a producir: " + cantidadProduccion + "\n";
mensaje += "Materiales: ";

 for (let i = 0; i < materiales.length; i++) {
  mensaje += materiales[i].nombre + ": $" + materiales[i].costoTotal;
  if (i < materiales.length - 1) {
    mensaje += " | "; 
}
}

mensaje += "\n| Total gastos variables: $" + totalVariables + " |";
mensaje += "\n| Total gastos fijos: $" + totalFijos + " |";
mensaje += "\n| Costo total: $" + costoTotal + " | ";
mensaje += "\n| Costo por unidad: $" + costoPorUnidad + " | ";
mensaje += "\n| Costo con ganancia: $" + costoConGanancia + " | ";

alert(mensaje);

  /* Mostrar todos los resultados detalalados en consola
  console.log("-----RESUMEN DE COSTOS-----");
  console.log("Producto: " + nombreProducto);
  console.log("Cantidad a producir: " + cantidadProduccion);

  console.log("Materiales:");
  for (let i = 0; i < materiales.length; i++) {
    console.log(materiales[i].nombre + ": $" + materiales[i].costoTotal);
  }

  console.log("Total gastos variables: $" + totalVariables);
  console.log("Total gastos fijos: $" + totalFijos);
  console.log("Costo total: $" + costoTotal);
  console.log("Costo por unidad: $" + costoPorUnidad);
  console.log("Costo por unidad con ganancia: $" + costoConGanancia);
  */

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
