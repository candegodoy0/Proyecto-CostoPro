import Calculadora from './Calculadora.js';
import GastoFijo from './GastoFijo.js';
import Material from './Material.js';


// formularios y elementos del DOM utilizados 
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

let indiceGastoAEditar = null;
let indiceEditandoMaterial  = null; // Para saber si estamos editanto un material

function refrescarUI(){
  actualizarTablaGastosFijos();
  actualizarTablaMateriales();
  guardarDatosEnStorage();
}

calculadora.subscriber(refrescarUI);
  
// Recuperar materiales y gastos fijos previamente guardados en localStorage
recuperarDatosPrevios();

// FUNCIONES

function mostrarResumenEnPantalla(resumen) {
  totalVariablesDOM.textContent = `$${resumen.totalVariables.toFixed(2)}`;
  totalFijosDOM.textContent = `$${resumen.totalFijos.toFixed(2)}`;
  costoTotalDOM.textContent = `$${resumen.costoTotal.toFixed(2)}`;
  costoGananciaDOM.textContent = `$${resumen.costoTotalConGanancia.toFixed(2)}`;
}

/**
 * se agrega una fila a la tabla de materiales con los datos del material
 * y botones para editar o eliminar
 */
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

/**
 * se agrega una fila a la tabla de gastos fijos con los datos del gasto
 * y botones para editar o eliminar
 *
 */

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

/**
 * se guarda los arrays de materiales y gastos fijos en localStorage
 */
function guardarDatosEnStorage() {
  localStorage.setItem("materiales", JSON.stringify(calculadora.materiales));
  localStorage.setItem("gastosFijos", JSON.stringify(calculadora.gastosFijos));
}

/**
 * se carga los datos de materiales y gastos fijos desde localStorage,
 * y actualiza las tablas en pantalla
 */
function recuperarDatosPrevios() {
  const materialesGuardados = JSON.parse(localStorage.getItem("materiales")) || [];
  const gastosFijosGuardados = JSON.parse(localStorage.getItem("gastosFijos")) || [];
  calculadora.materiales = materialesGuardados.map(obj => 
    new Material(obj.nombre, obj.costoUnitario, obj.cantidad, obj.unidad, obj.unidadesPorSeleccionada)
  );
  calculadora.gastosFijos = gastosFijosGuardados.map(obj => 
    new GastoFijo(obj.concepto, obj.costo)
  );

  refrescarUI();
}

function validarMaterial({ nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada }) {
  return (
    nombre &&
    !isNaN(costoUnitario) && costoUnitario > 0 &&
    !isNaN(cantidad) && cantidad > 0 &&
    unidad &&
    !isNaN(unidadesPorSeleccionada) && unidadesPorSeleccionada > 0
  );
}

function validarGasto({ concepto, costo }) {
  return concepto.trim() !== "" && !isNaN(costo) && costo > 0;
}

function confirmarVaciar({ tabla, onConfirm, colspan, mensaje }) {
  tabla.innerHTML = "";
  const filaConfirmacion = document.createElement("tr");
  filaConfirmacion.innerHTML = `
    <td colspan="${colspan}" class="text-center text-danger">
      ${mensaje}
      <button class="btn btn-danger btn-sm btn-confirmar-vaciar">Confirmar</button>
      <button class="btn btn-secondary btn-sm btn-cancelar-vaciar">Cancelar</button>
    </td>
  `;
  tabla.appendChild(filaConfirmacion);
  filaConfirmacion.querySelector(".btn-confirmar-vaciar").addEventListener("click", () => {
    onConfirm();
  });
  filaConfirmacion.querySelector(".btn-cancelar-vaciar").addEventListener("click", () => {
    if (tabla === tablaMateriales) {
      actualizarTablaMateriales();
    } else {
      actualizarTablaGastosFijos();
    }
  });
}

function actualizarTablaMateriales() {
  tablaMateriales.innerHTML = "";
  calculadora.materiales.forEach((material, index) => {
    mostrarMaterialEnTabla(material, index);
  });
}

function actualizarTablaGastosFijos() {
  tablaGastosFijos.innerHTML = "";
  calculadora.gastosFijos.forEach((gasto, index) => {
    mostrarGastoFijoEnTabla(gasto, index);
  });
}

// Evento para agregar material
formProducto.addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre-material").value.trim();
  const costoUnitario = parseFloat(document.getElementById("costo-material").value);
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const unidad = document.getElementById("unidad-material").value.trim();
  const unidadesPorSeleccionada = parseFloat(document.getElementById("cantidad-equivalente").value);
  const mensajeError = document.getElementById("mensaje-error-material");
  const material = { nombre, costoUnitario, cantidad, unidad, unidadesPorSeleccionada };
  if (validarMaterial(material)) {
    mensajeError.textContent = "";
    if (indiceEditandoMaterial !== null) {
      // SI SE ESTA editando, actualizamos el material
      calculadora.actualizarMaterial(indiceEditandoMaterial, material);
      indiceEditandoMaterial = null;
      document.querySelector("#producto button[type='submit']").textContent = "Agregar material";
    } else {
      // SI NO SE ESTA editando, agregamos uno nuevo
      calculadora.agregarMaterial(material);
    }
    guardarDatosEnStorage();
    formProducto.reset(); 
    // SE MUESTRA MODAL
    const modalMaterial = new bootstrap.Modal(document.getElementById('agregarMaterial'));
    modalMaterial.show();
  } else {
    mensajeError.textContent = "Por favor, completá todos los campos correctamente y con valores mayores a cero.";
  }
});

//Evento para editar material
tablaMateriales.addEventListener("click", (e) => {
  if (e.target.dataset.tipo === "editar-material") {
    const index = parseInt(e.target.dataset.index);
    const m = calculadora.materiales[index];

    document.getElementById("nombre-material").value = m.nombre;
    document.getElementById("costo-material").value = m.costoUnitario;
    document.getElementById("cantidad").value = m.cantidad;
    document.getElementById("unidad-material").value = m.unidad;
    document.getElementById("cantidad-equivalente").value = m.unidadesPorSeleccionada;

    indiceEditandoMaterial = index;

    // Se cambia el texto del botón para que noo diga agregar
    document.querySelector("#producto button[type='submit']").textContent = "Actualizar material";
  }
});
 
// Evento para editar gasto fijo
tablaGastosFijos.addEventListener("click", (e) => {
  // Prellena el formulario y elimina el gasto para reemplazarlo
  if (e.target.dataset.tipo === "editar-gasto") {
    const index = parseInt(e.target.dataset.index);
    const gasto = calculadora.gastosFijos[index]; 
    document.getElementById("concepto-fijo").value = gasto.concepto; 
    document.getElementById("costo-fijo").value = gasto.costo; 
    
      indiceGastoAEditar = index;

    // Se cambia texto del botón
    document.querySelector("#gastos-fijos button[type='submit']").textContent = "Actualizar gasto fijo";

  }
});

tablaMateriales.addEventListener("click", (e) => {
  // se confirma con el usuario antes de eliminar un material de la lista
// se muestra botones de "Confirmar" y "Cancelar" dentro de la fila
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
      calculadora.eliminarMaterial(index);
      guardarDatosEnStorage();
    });

    fila.querySelector(".btn-cancelar").addEventListener("click", () => {
    });
  }
});

tablaGastosFijos.addEventListener("click", (e) => {
  const index = parseInt(e.target.dataset.index);
  const fila = e.target.closest("tr");

  // confirmar eliminación de gasto
  if (e.target.dataset.tipo === "gasto") {
    if (fila.querySelector(".btn-confirmar")) return;

    fila.innerHTML = `
      <td colspan="3" class="text-center text-danger">
        ¿Seguro que quieres eliminar este gasto?
        <button class="btn btn-danger btn-sm btn-confirmar" data-index="${index}">Confirmar</button>
        <button class="btn btn-secondary btn-sm btn-cancelar">Cancelar</button>
      </td>
    `;

    fila.querySelector(".btn-confirmar").addEventListener("click", () => {
      calculadora.eliminarGastoFijo(index);
      guardarDatosEnStorage();
    });

    fila.querySelector(".btn-cancelar").addEventListener("click", () => {
    });
  }
});

// Evento para  aregar gasto fijo
formGastoFijo.addEventListener("submit", function (e) {
  e.preventDefault();

  const concepto = document.getElementById("concepto-fijo").value;
  const costo = parseFloat(document.getElementById("costo-fijo").value);
  const mensajeError = document.getElementById("mensaje-error-gasto");

  const gasto = { concepto, costo};

  if (validarGasto(gasto)) {
    mensajeError.textContent = "";

    if (indiceGastoAEditar !== null) {
     calculadora.actualizarGastoFijo(indiceGastoAEditar, gasto);
      indiceGastoAEditar = null;

      const boton = document.querySelector("#gastos-fijos button[type='submit']");
      boton.textContent = "Agregar gasto fijo";
    } else {
      calculadora.agregarGastoFijo(concepto, costo);
    }
    guardarDatosEnStorage();
    formGastoFijo.reset();

    const modalGasto = new bootstrap.Modal(document.getElementById('agregarGasto'));
    modalGasto.show();
  } else {
    mensajeError.textContent = "Por favor, completá todos los campos correctamente y con valores mayores a cero.";
  }
  });

// Evento para calcular costos totales de producción
// se aplivca ganancia porcentual y muestra resultados 
formCalculadora.addEventListener("submit", function (e) {
  e.preventDefault();

  const gananciaPorcentual = parseFloat(document.getElementById("ganancia").value);
  const cantidadProduccion = parseInt(document.getElementById("cantidadTotal").value);

  // se valida si hay al menos un material o gasto fijo
  if (calculadora.materiales.length === 0 && calculadora.gastosFijos.length === 0) {
    const modalAntesDeCalcular = new bootstrap.Modal(document.getElementById('modalAntesDeCalcular'));
    modalAntesDeCalcular.show();
    return;
  }

  // se validan datos de ganancia y cantidad de producción
if (!isNaN(gananciaPorcentual) && !isNaN(cantidadProduccion) && cantidadProduccion > 0) {
    // Se llama a generarResumen, que devuelve todos los calculos hechos
    const resumen = calculadora.generarResumen(gananciaPorcentual, cantidadProduccion);
    mostrarResumenEnPantalla(resumen);

    const modalFinal = new bootstrap.Modal(document.getElementById('calculosFinales'));
    modalFinal.show();
  }
});

// Vacía completamente la lista de materiales después de una confirmación del usuario
document.getElementById("vaciar-materiales").addEventListener("click", function () {
  if (calculadora.isMaterialesEmpty()) {
    return;
  }
  confirmarVaciar({
    tabla: tablaMateriales,
    onConfirm: () => {
      calculadora.vaciarMateriales();
      guardarDatosEnStorage();
    },
    colspan: 4,
    mensaje: "¿Seguro que quieres vaciar todos los materiales?"
  });
});


// Vacía completamente la lista de gastos fijos después de una confirmación del usuario
document.getElementById("vaciar-gastos").addEventListener("click", function () {
  if (calculadora.isGastosFijosEmpty()) {
    return;
  }
  confirmarVaciar({
    tabla: tablaGastosFijos,
    onConfirm: () => {
      calculadora.vaciarGastosFijos();
      guardarDatosEnStorage();
    },
    colspan: 3,
    mensaje: "¿Seguro que quieres vaciar todos los gastos fijos?"
  });
});