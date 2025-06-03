
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

 // SE Genera un resumen de los cálculos en formato objeto (desacoplado del DOM)
  generarResumen(gananciaPorcentual, cantidadProduccion) {
    const totalVariables = this.calcularCostoMaterialesTotal(cantidadProduccion);
    const totalFijos = this.calcularGastosFijos();
    const costoTotal = totalVariables + totalFijos;
    const costoTotalConGanancia = costoTotal * (1 + gananciaPorcentual / 100);
    const costoPorUnidadConGanancia = costoTotalConGanancia / cantidadProduccion;

    return {
      cantidadProduccion,
      totalVariables,
      totalFijos,
      costoTotal,
      costoTotalConGanancia,
      costoPorUnidadConGanancia,
      materiales: this.materiales.map((m) => ({
        nombre: m.nombre,
        costoTotal: m.calcularCostoTotal(),
        unidad: m.unidad,
        cantidad: m.cantidad,
        costoUnitario: m.costoUnitario
      })),
      gastosFijos: this.gastosFijos.map((g) => ({
        concepto: g.concepto,
        costo: g.costo
      }))
    };
  }

  vaciarMateriales() {
    this.materiales = [];
  }

  vaciarGastosFijos() {
    this.gastosFijos = [];
  }

  eliminarMaterial(index) {
  this.materiales.splice(index, 1);
}

eliminarGastoFijo(index) {
  this.gastosFijos.splice(index, 1);
}

isMaterialsEmpty() {
  return this.materiales.length === 0;
}

isGastosFijosEmpty() {
  return this.gastosFijos.length === 0;
}

}

export default Calculadora;