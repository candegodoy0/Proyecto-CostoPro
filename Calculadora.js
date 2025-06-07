
import GastoFijo from './GastoFijo.js';
import Material from './Material.js';


class Calculadora{
    constructor() {
    this.materiales = [];
    this.gastosFijos = [];
    this.subscribers = [];
  }

  subscriber(fn){
    this.subscribers.push(fn);
  }

  notify(){
  this.subscribers.forEach(fn => fn());
  }

  // Funcion para modificar /edtar un material 
  actualizarMaterial(index, { nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada }) {
  this.materiales[index] = new Material(nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada);
  this.notify();
}

// Funcion para modificar / editarlo un gasto fijo 
actualizarGastoFijo(indice, { concepto, costo }) {
  if (indice >= 0 && indice < this.gastosFijos.length) {
    this.gastosFijos[indice] = new GastoFijo(concepto, costo);
    this.notify();
  }
}

  //Función para agregar materiales necesarios para fabricar una unidad de producto//

   agregarMaterial({ nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada }) {
    // Se agrega el material al array con los datos necesarios
    this.materiales.push(new Material(nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada));
    this.notify();
  }

  //Función para ingresar los gastos fijos que no dependen de la cantidad producida. Ejemplo: alquiler, sueldos, etc.//
  agregarGastoFijo(concepto, costo) {
     // Se agrega el gasto fijo al array
    this.gastosFijos.push(new GastoFijo(concepto, costo));
    this.notify();
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
    this.notify();
  }

  vaciarGastosFijos() {
    this.gastosFijos = [];
    this.notify();
  }

  eliminarMaterial(index) {
  this.materiales.splice(index, 1);
  this.notify();
}

eliminarGastoFijo(index) {
  this.gastosFijos.splice(index, 1);
  this.notify();
}

isMaterialesEmpty() {
  return this.materiales.length === 0;
}

isGastosFijosEmpty() {
  return this.gastosFijos.length === 0;
}

}

export default Calculadora;