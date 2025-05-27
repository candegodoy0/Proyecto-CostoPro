import Calculadora from './Calculadora.js';
 
const formProducto = document.querySelector("#producto form");
const formGastoFijo =   document.querySelector("#gastos-fijos form");
const formCalculadora = document.querySelector("#calculadora form");

const tablaMateriales = document.querySelector("#tabla-materiales tbody");
const tablaGastosFijos = document.querySelector("#tabla-gastos-fijos tbody");
const totalVariablesDOM = document.getElementById("total-variables");
const totalFijosDOM = document.getElementById("total-fijos");
const costoTotalDOM = document.getElementById("costo-total");
const costoGananciaDOM = document.getElementById("costo-ganancia");

// Se crea la instancia de la calculadora
let calculadora = new Calculadora();
  
// Se cargan los datos previos guardados 
recuperarDatosPrevios();

// FUNCIONES

// Se muestra material en la tabla y se actualzian los datos 
function mostrarMaterialEnTabla(material, index) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${material.nombre}</td>
    <td>$${material.costoUnitario}</td>
    <td>${material.cantidad}</td>
  <td>
  <div class="d-flex gap-1">
    <button class="btn btn-danger btn-sm" data-index="${index}" data-tipo="material">🗑️</button>
    <button class="btn btn-warning btn-sm" data-index="${index}" data-tipo="editar-material">✏️</button>
  </div>
</td>
  `;
  tablaMateriales.appendChild(fila);
}

//// Se muestra gasto fijo en la tabla y se actualzian los datos 
function mostrarGastoFijoEnTabla(gasto, index) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${gasto.concepto}</td>
    <td>$${gasto.costo}</td>
  <td>
      <div class="d-flex gap-1">
        <button class="btn btn-danger btn-sm" data-index="${index}" data-tipo="gasto">🗑️</button>
        <button class="btn btn-warning btn-sm" data-index="${index}" data-tipo="editar-gasto">✏️</button>
      </div>
    </td>
  `;
  tablaGastosFijos.appendChild(fila);
}

// Se guardan datos actualizados 
function guardarDatosEnStorage() {
  localStorage.setItem("materiales", JSON.stringify(calculadora.materiales));
  localStorage.setItem("gastosFijos", JSON.stringify(calculadora.gastosFijos));
}

// Se leen los datos guardados y se vuelven a mostrar en las tablas
function recuperarDatosPrevios() {
  const materialesGuardados = JSON.parse(localStorage.getItem("materiales")) || [];
  const gastosFijosGuardados = JSON.parse(localStorage.getItem("gastosFijos")) || [];

  calculadora.materiales = materialesGuardados;
  calculadora.gastosFijos = gastosFijosGuardados;

  actualizarTablaMateriales();
  actualizarTablaGastosFijos();
}

function actualizarTablaMateriales() {
  tablaMateriales.innerHTML = "";
  calculadora.materiales.forEach((m, i) => mostrarMaterialEnTabla(m, i));
}

function actualizarTablaGastosFijos() {
  tablaGastosFijos.innerHTML = "";
  calculadora.gastosFijos.forEach((g, i) => mostrarGastoFijoEnTabla(g, i));
}

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
   actualizarTablaMateriales(); 
    guardarDatosEnStorage();

    //Se limpian los campos
    formProducto.reset();

     // Se muestra modal dependiendo si se completaron o no los campos
  const modalMaterial = new bootstrap.Modal(document.getElementById('agregarMaterial'));
  modalMaterial.show();
} 
  }
);


//Evento para editar material
tablaMateriales.addEventListener("click", (e) => {
  if (e.target.dataset.tipo === "editar-material") {
    const index = parseInt(e.target.dataset.index);
    const m = calculadora.materiales[index];

    // Prellenar el formulario
    document.getElementById("nombre-material").value = m.nombre;
    document.getElementById("costo-material").value = m.costoUnitario;
    document.getElementById("cantidad").value = m.cantidad;
    document.getElementById("unidad-material").value = m.unidad;
    document.getElementById("cantidad-equivalente").value = m.unidadesPorSeleccionada;

    // Eliminar y esperar nuevo submit
    calculadora.materiales.splice(index, 1);
    guardarDatosEnStorage();
    actualizarTablaMateriales();
  }
});


// Evento para editar gasto fijo
tablaGastosFijos.addEventListener("click", (e) => {
  if (e.target.dataset.tipo === "editar-gasto") {
    const index = parseInt(e.target.dataset.index);
    const g = calculadora.gastosFijos[index];

    document.getElementById("concepto-fijo").value = g.concepto;
    document.getElementById("costo-fijo").value = g.costo;

    calculadora.gastosFijos.splice(index, 1);
    guardarDatosEnStorage();
    actualizarTablaGastosFijos();
  }
});

tablaMateriales.addEventListener("click", (e) => {
  if (e.target.dataset.tipo === "material") {
    const fila = e.target.closest("tr");
    const index = parseInt(e.target.dataset.index);

    if (fila.querySelector(".btn-confirmar")) return;

    fila.innerHTML = `
      <td colspan="4" class="text-center text-danger">
        ¿Seguro que quieres eliminar este material?
        <button class="btn btn-danger btn-sm btn-confirmar" data-index="${index}">Confirmar</button>
        <button class="btn btn-secondary btn-sm btn-cancelar">Cancelar</button>
      </td>
    `;

    fila.querySelector(".btn-confirmar").addEventListener("click", () => {
      calculadora.materiales.splice(index, 1);
      guardarDatosEnStorage();
      actualizarTablaMateriales();
    });

    fila.querySelector(".btn-cancelar").addEventListener("click", () => {
      actualizarTablaMateriales();
    });
  }
});

tablaGastosFijos.addEventListener("click", (e) => {
  if (e.target.dataset.tipo === "gasto") {
    const fila = e.target.closest("tr");
    const index = parseInt(e.target.dataset.index);

    if (fila.querySelector(".btn-confirmar")) return;

    fila.innerHTML = `
      <td colspan="3" class="text-center text-danger">
        ¿Seguro que quieres eliminar este gasto?
        <button class="btn btn-danger btn-sm btn-confirmar" data-index="${index}">Confirmar</button>
        <button class="btn btn-secondary btn-sm btn-cancelar">Cancelar</button>
      </td>
    `;

    fila.querySelector(".btn-confirmar").addEventListener("click", () => {
      calculadora.gastosFijos.splice(index, 1);
      guardarDatosEnStorage();
      actualizarTablaGastosFijos();
    });

    fila.querySelector(".btn-cancelar").addEventListener("click", () => {
      actualizarTablaGastosFijos();
    });
  }
});


// Evento para  aregar gasto fijo
formGastoFijo.addEventListener("submit", function (e) {
  e.preventDefault();
  const concepto = document.getElementById("concepto-fijo").value.trim();
  const costo = parseFloat(document.getElementById("costo-fijo").value);

  if (concepto && !isNaN(costo)) {
    calculadora.agregarGastoFijo(concepto, costo);
  actualizarTablaGastosFijos();
    guardarDatosEnStorage();

    formGastoFijo.reset();

     // Mostrar modal manualmente
  const modalGasto = new bootstrap.Modal(document.getElementById('agregarGasto'));
  modalGasto.show();
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

// Se muestra modal dependiendo si se completaron o no los campos
    const modalFinal = new bootstrap.Modal(document.getElementById('calculosFinales'));
modalFinal.show();
  }
});

document.getElementById("vaciar-materiales").addEventListener("click", function () {
  if (calculadora.materiales.length === 0) {
    return; 
  }
  
  const filaConfirmacion = document.createElement("tr");
  filaConfirmacion.innerHTML = `
    <td colspan="4" class="text-center text-danger">
      ¿Seguro que quieres vaciar todos los materiales?
      <button class="btn btn-danger btn-sm btn-confirmar-vaciar">Confirmar</button>
      <button class="btn btn-secondary btn-sm btn-cancelar-vaciar">Cancelar</button>
    </td>
  `;
  tablaMateriales.innerHTML = "";
  tablaMateriales.appendChild(filaConfirmacion);

  filaConfirmacion.querySelector(".btn-confirmar-vaciar").addEventListener("click", () => {
    calculadora.materiales = [];
    guardarDatosEnStorage();
    actualizarTablaMateriales();
  });

  filaConfirmacion.querySelector(".btn-cancelar-vaciar").addEventListener("click", () => {
    actualizarTablaMateriales();
  });
});

document.getElementById("vaciar-gastos").addEventListener("click", function () {
  if (calculadora.gastosFijos.length === 0) {
    return;
  }
  
  const filaConfirmacion = document.createElement("tr");
  filaConfirmacion.innerHTML = `
    <td colspan="3" class="text-center text-danger">
      ¿Seguro que quieres vaciar todos los gastos fijos?
      <button class="btn btn-danger btn-sm btn-confirmar-vaciar">Confirmar</button>
      <button class="btn btn-secondary btn-sm btn-cancelar-vaciar">Cancelar</button>
    </td>
  `;
  tablaGastosFijos.innerHTML = "";
  tablaGastosFijos.appendChild(filaConfirmacion);

  filaConfirmacion.querySelector(".btn-confirmar-vaciar").addEventListener("click", () => {
    calculadora.gastosFijos = [];
    guardarDatosEnStorage();
    actualizarTablaGastosFijos();
  });

  filaConfirmacion.querySelector(".btn-cancelar-vaciar").addEventListener("click", () => {
    actualizarTablaGastosFijos();
  });
});