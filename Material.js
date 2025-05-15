  class Material {
  constructor(nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada) {
    this.nombre = nombre;
    this.costoUnitario = costoUnitario;
    this.cantidad = cantidad;
    this.unidad = unidad;
    this.unidadesPorSeleccionada = unidadesPorSeleccionada;
  }
  calcularCostoPorUnidadProducto() {
    return (this.costoUnitario / this.unidadesPorSeleccionada) * this.cantidad;
  }
}

export default Material