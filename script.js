import Calculadora from './Calculadora.js';
import Material from './Material.js';
import GastoFijo from './GastoFijo.js';

function iniciarCaluladora(){
    alert("Bienvenido a CostoPro - Calculadora de Costos de Producción");

// Declaracion de variable para guardar el nombre del producto ingresado por el usuario
const nombreProducto = prompt("Ingrese el nombre del producto (ej: Mesa):");
const calculadora = new Calculadora(nombreProducto);

  let salir = false;
  let gananciaPorcentual = null;
let cantidadProduccion = null;

  while (!salir) {
    const opcion = prompt(
      `MENÚ PRINCIPAL - ${nombreProducto}\n` +
      `1. Agregar material\n` +
      `2. Agregar gasto fijo\n` +
      `3. Ingresar porcentaje de ganancia y cantidad a producir\n` +
      `4. Calcular y mostrar resumen\n` +
      `5. Salir\n\n` +
      `Ingrese una opción:`
    );

switch(opcion){
        // Agregar materiales
  case "1":
let seguirMaterial = true;
        while (seguirMaterial) {
    let nombre = prompt("Ingrese el nombre del material (ej: Tornillo):");
    let costoUnitario = parseFloat(prompt('Ingrese el costo por unidad de ${nombre}(ej: $1.000):'));
    let cantidad = parseFloat(prompt('Ingrese la cantidad requerida de ${nombre} por unidad de producto (ej: 150):'));
    let unidad = prompt("Ingrese la unidad de medida para ${nombre} (ej: litro, metro, caja):");
    let unidadesPorSeleccionada = parseFloat(prompt('Ingrese cantidad de unidades estándar que hay por cada ${unidad} (ej: 12 si una caja tiene 12 unidades):'));

    if (
  !nombre || isNaN(costoUnitario) || isNaN(cantidad) ||
  !unidad || isNaN(unidadesPorSeleccionada)) {
      alert("Por favor, ingrese datos válidos.");
}else{
        calculadora.agregarMaterial({ nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada });
    alert(" Material agregado correctamente.");
}
        seguirMaterial = confirm("¿Quiere agregar otro material?");
  }
  break;

  // Agregar gastos fijos
  case "2":
       let seguirGasto = true;
        while (seguirGasto) {
    let concepto = prompt("Ingrese el concepto del gasto fijo (ej: Alquiler):");
    let costo = parseFloat(prompt('Ingrese el costo del gasto fijo ${concepto} (ej: $1000.00): '));
    
    if (!concepto || isNaN(costo)) {
      alert("Por favor, ingrese un valor numérico válido.");
    }else{
    calculadora.agregarGastoFijo(concepto, costo);
     alert(" Gasto fijo agregado correctamente.");
    }
    seguirGasto = confirm("¿Quiere agregar otro gasto?");
  }
  break;

case "3":
  gananciaPorcentual = parseFloat(prompt("Ingrese el porcentaje de ganancia que desee (ej: 25%):"));
  let cantidadProduccion = parseInt(prompt("Ingrese la cantidad total a producir (ej: 200):"));

  if (isNaN(cantidadProduccion) || isNaN(gananciaPorcentual) || cantidadProduccion <= 0) {
    alert("Cantidad o ganancia ingresadas inválidas.");
  }else{
    alert("Valores guardados correctamente")
  }
    break;
  
    case "4":
      if (calculadora.materiales.length === 0 || calculadora.gastosFijos.length === 0) {
          alert("Debe agregar al menos un material y un gasto fijo antes de calcular.");
        } else if (gananciaPorcentual === null || cantidadProduccion === null) {
          alert("Debe ingresar la ganancia y la cantidad a producir antes de calcular.");
        } else {
          const resumen = calculadora.generarResumen(gananciaPorcentual, cantidadProduccion);
          alert(resumen);
        }
        break;

         case "5":
        salir = true;
        alert("Gracias por usar CostoPro.");
        break;

      default:
        alert("Opción inválida. Ingrese un número del 1 al 5.");
        break;
}
  }
}
iniciarCaluladora(); 