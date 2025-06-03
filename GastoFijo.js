class GastoFijo {
  constructor(concepto, costo) {
    this.concepto = concepto.trim();
    const costoParseado = parseFloat(costo);
    if (isNaN(costoParseado)) {
      throw new Error('El costo debe ser un número válido');
    }
    this.costo = costoParseado;
  }
}

export default GastoFijo;