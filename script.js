import Calculadora from './Calculadora.js';

const formProducto = document.querySelector("#producto form");
const formGastoFijo = document.querySelector("#gastos-fijos form");
const formCalculadora = document.querySelector("#calculadora form");

const tablaMateriales = document.querySelector("#tabla-materiales tbody");
const tablaGastosFijos = document.querySelector("#tabla-gastos-fijos tbody");
const totalVariablesDOM = document.getElementById("total-variables");
const totalFijosDOM = document.getElementById("total-fijos");
const costoTotalDOM = document.getElementById("costo-total");
const costoGananciaDOM = document.getElementById("costo-ganancia");

// Se crea la instancia de la calculadora
let nombreProducto = localStorage.getItem("nombreProducto") || "Producto sin nombre";
let calculadora = new Calculadora(nombreProducto);

// Se cargan los datos previos guardados 
recuperarDatosPrevios();

// FUNCIONES

// Se muestra material en la tabla y se actualzian los datos 
function mostrarMaterialEnTabla(material) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${material.nombre}</td>
    <td>$${material.costoUnitario}</td>
    <td>${material.cantidad}</td>
  `;
  tablaMateriales.appendChild(fila);
}

// Se muestra gasto fijo en la tabla y actualizar storage
function mostrarGastoFijoEnTabla(gasto) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${gasto.concepto}</td>
    <td>$${gasto.costo}</td>
  `;
  tablaGastosFijos.appendChild(fila);
}

// Se guardan datos actualizados 
function guardarDatosEnStorage() {
  localStorage.setItem("nombreProducto", calculadora.nombreProducto);
  localStorage.setItem("materiales", JSON.stringify(calculadora.materiales));
  localStorage.setItem("gastosFijos", JSON.stringify(calculadora.gastosFijos));
}

// Se leen los datos guardados y se vuelven a mostrar en las tablas
function recuperarDatosPrevios() {
  const materialesGuardados = JSON.parse(localStorage.getItem("materiales")) || [];
  const gastosFijosGuardados = JSON.parse(localStorage.getItem("gastosFijos")) || [];

  materialesGuardados.forEach((m) => {
    calculadora.agregarMaterial(m);
    mostrarMaterialEnTabla(m);
  });

  gastosFijosGuardados.forEach((g) => {
    calculadora.agregarGastoFijo(g.concepto, g.costo);
    mostrarGastoFijoEnTabla(g);
  });
}

// Evento para gregar producto
formProducto.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputNombre = document.getElementById("nombre-producto");
  calculadora.nombreProducto = inputNombre.value.trim();
  localStorage.setItem("nombreProducto", calculadora.nombreProducto);
  inputNombre.value = "";
});

// Evento para agregar material
formProducto.addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre-material").value.trim();
  const costoUnitario = parseFloat(document.getElementById("costo-material").value);
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const unidad = document.getElementById("unidad-material").value;
  const unidadesPorSeleccionada = parseFloat(document.getElementById("cantidad-equivalente").value);

  if (nombre && !isNaN(costoUnitario) && !isNaN(cantidad) && unidad && !isNaN(unidadesPorSeleccionada)) {
    const material = { nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada };
    calculadora.agregarMaterial(material);
    mostrarMaterialEnTabla(material);
    guardarDatosEnStorage();

    // Se limpian los campos
    formProducto.reset();
  }
});

// Evento para  aregar gasto fijo
formGastoFijo.addEventListener("submit", function (e) {
  e.preventDefault();
  const concepto = document.getElementById("concepto-fijo").value.trim();
  const costo = parseFloat(document.getElementById("costo-fijo").value);

  if (concepto && !isNaN(costo)) {
    calculadora.agregarGastoFijo(concepto, costo);
    mostrarGastoFijoEnTabla({ concepto, costo });
    guardarDatosEnStorage();

    formGastoFijo.reset();
  }
});

// Evento para calcular los costos finales
formCalculadora.addEventListener("submit", function (e) {
  e.preventDefault();
  const gananciaPorcentual = parseFloat(document.getElementById("ganancia").value);
  const cantidadProduccion = parseInt(document.getElementById("cantidadTotal").value);

  if (!isNaN(gananciaPorcentual) && !isNaN(cantidadProduccion) && cantidadProduccion > 0) {
    const resumen = calculadora.generarResumen(gananciaPorcentual, cantidadProduccion);

    // se muestran los resultados 
    const totalVariables = calculadora.calcularCostoMaterialesTotal(cantidadProduccion);
    const totalFijos = calculadora.calcularGastosFijos();
    const costoTotal = totalVariables + totalFijos;
    const costoTotalConGanancia = costoTotal * (1 + gananciaPorcentual / 100);
    const costoUnidad = costoTotalConGanancia / cantidadProduccion;

totalVariablesDOM.textContent = `$${totalVariables.toFixed(2)}`;
totalFijosDOM.textContent = `$${totalFijos.toFixed(2)}`;
costoTotalDOM.textContent = `$${costoTotalConGanancia.toFixed(2)}`;
costoGananciaDOM.textContent = `$${costoUnidad.toFixed(2)}`;
  }
});