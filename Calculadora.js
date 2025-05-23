
import GastoFijo from './GastoFijo.js';
import Material from './Material.js';


class Calculadora{
    constructor() {
    this.materiales = [];
    this.gastosFijos = [];
  }

  /*
- Función para agregar materiales necesarios para fabricar una unidad de producto.
- El usuario puede ingresar uno o mas materiales.
- Cada material tiene un nombre, costo por unidad, cantidad necesaria, y costo total.
*/

   agregarMaterial({ nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada }) {
    // Se agrega el material al array con los datos necesarios
    this.materiales.push(new Material(nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada));
  }

  //Función para ingresar los gastos fijos que no dependen de la cantidad producida. Ejemplo: alquiler, sueldos, etc.//
  agregarGastoFijo(concepto, costo) {
     // Se agrega el gasto fijo al array
    this.gastosFijos.push(new GastoFijo(concepto, costo));
  }

  calcularCostoMaterialesUnitario() {
    return this.materiales.reduce((total, material) => total + material.calcularCostoPorUnidadProducto(), 0);
  }

  calcularCostoMaterialesTotal(cantidad) {
    return this.calcularCostoMaterialesUnitario() * cantidad;
  }

  calcularGastosFijos() {
    return this.gastosFijos.reduce((total, gasto) => total + gasto.costo, 0);
  }

  generarResumen(gananciaPorcentual, cantidadProduccion) {
    const totalVariables = this.calcularCostoMaterialesTotal(cantidadProduccion);
    const totalFijos = this.calcularGastosFijos();
    const costoTotal = totalVariables + totalFijos;
    const costoTotalConGanancia = costoTotal * (1 + gananciaPorcentual / 100);
    const costoPorUnidadConGanancia = costoTotalConGanancia / cantidadProduccion;

    // Mensaje para mostrar al usuario de manera inmediata los resultados de los calculos 
    let mensaje = "CÁLCULO FINALIZADO\n";
    mensaje += "Cantidad a producir: " + cantidadProduccion + "\n";
    mensaje += "Materiales: ";

    for (let i = 0; i < this.materiales.length; i++) {
      const material = this.materiales[i];
      mensaje += material.nombre + ": $" + material.calcularCostoTotal();
      if (i < this.materiales.length - 1) mensaje += " | ";
    }

    mensaje += `\n| Total gastos variables: $${totalVariables} |`;
    mensaje += `\n| Total gastos fijos: $${totalFijos} |`;
    mensaje += `\n| Costo final (con ganancia) para ${cantidadProduccion} unidades: $${costoTotalConGanancia} |`;
    mensaje += `\n| Costo por unidad (con ganancia): $${costoPorUnidadConGanancia} |`;

    return mensaje;
  }
}

export default Calculadora
