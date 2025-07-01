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
  costoGananciaDOM.textContent = `$${resumen.costoPorUnidadConGanancia.toFixed(2)}`;
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

        // alerta de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Material agregado!',
      text: 'El material fue agregado con éxito',
      timer: 1500,
      showConfirmButton: false
 
});

  } else {

    // Alerta de error de validación
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Completá todos los campos con valores válidos y mayores a cero.'
    });
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
    const index = parseInt(e.target.dataset.index);

Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este material se eliminará permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        calculadora.eliminarMaterial(index);
        guardarDatosEnStorage();
        actualizarTablaMateriales(); // refrescar la tabla después de eliminar
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El material fue eliminado correctamente'
        });
      }
    });
  }
});

tablaGastosFijos.addEventListener("click", (e) => {
    if (e.target.dataset.tipo === "gasto") {
  const index = parseInt(e.target.dataset.index);

  // confirmar eliminación de gasto
  Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este gasto fijo se eliminará permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        calculadora.eliminarGastoFijo(index);
        guardarDatosEnStorage();
        actualizarTablaGastosFijos();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El gasto fue eliminado correctamente'
        });
      }
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

      // alerta de éxito
    Swal.fire({
      icon: 'success',
      title: 'Gasto agregado!',
      text: 'El gasto fue agregado con éxito',
      timer: 1500,
      showConfirmButton: false
 
});

  } else {

    // Alerta de error de validación
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Completá todos los campos con valores válidos y mayores a cero.'
    });
  }
});

// Evento para calcular costos totales de producción
// se aplivca ganancia porcentual y muestra resultados 
formCalculadora.addEventListener("submit", function (e) {
  e.preventDefault();

  const gananciaPorcentual = parseFloat(document.getElementById("ganancia").value);
  const cantidadProduccion = parseFloat(document.getElementById("cantidadTotal").value);

  // se valida si hay al menos un material o gasto fijo
  if (calculadora.materiales.length === 0 && calculadora.gastosFijos.length === 0) {
Swal.fire({
    icon: 'warning',
    title: 'Datos incompletos',
    text: 'Debés ingresar al menos un material o un gasto fijo antes de calcular.'
  });
  return;
}

  // se validan datos de ganancia y cantidad de producción
if (!isNaN(gananciaPorcentual) && !isNaN(cantidadProduccion) && cantidadProduccion > 0) {
    // Se llama a generarResumen, que devuelve todos los calculos hechos
    const resumen = calculadora.generarResumen(gananciaPorcentual, cantidadProduccion);
    mostrarResumenEnPantalla(resumen);

           // Mostrar resumen
    Swal.fire({
      icon: 'info',
      title: 'Resumen del Costo',
      html: `
        <p>Total Gastos Variables: <strong>$${resumen.totalVariables.toFixed(2)}</strong></p>
        <p>Total Gastos Fijos: <strong>$${resumen.totalFijos.toFixed(2)}</strong></p>
        <p>Costo total (con ganancia): <strong>$${resumen.costoTotal.toFixed(2)}</strong></p>
       <p>Costo Por Unidad (con ganancia): <strong>$${resumen.costoPorUnidadConGanancia.toFixed(2)}</strong></p>
      `,
      confirmButtonText: 'Aceptar'
   }).then(() => {
  // se muestra la tabla solo después de cerrar el resumen de alerta
  document.getElementById('resultados').classList.remove('d-none');
});
  
    } else {

    // Alerta de error de validación
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Completá todos los campos con valores válidos y mayores a cero.'
    });
  }
  });


// Vacía completamente la lista de materiales después de una confirmación del usuario
document.getElementById("vaciar-materiales").addEventListener("click", function () {
  if (calculadora.isMaterialesEmpty()) 

    return;
 Swal.fire({
    title: '¿Estás segura?',
    text: 'Vas a eliminar todos los materiales',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      calculadora.vaciarMateriales();
      guardarDatosEnStorage();
      actualizarTablaMateriales();
      Swal.fire('Vaciado', 'Se eliminaron todos los materiales', 'success');
    }
  });
});

// Vacía completamente la lista de gastos fijos después de una confirmación del usuario
document.getElementById("vaciar-gastos").addEventListener("click", function () {
  if (calculadora.isGastosFijosEmpty()) 
    return;

  Swal.fire({
    title: '¿Estás segura?',
    text: 'Vas a eliminar todos los gastos fijos',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      calculadora.vaciarGastosFijos(); // ✔️ CORRECTO
      guardarDatosEnStorage();
      actualizarTablaGastosFijos();    // ✔️ CORRECTO
      Swal.fire('Vaciado', 'Se eliminaron todos los gastos fijos', 'success');
    }
  });
});


// Carga de materiales simulados desde archivo JSON/fwtch
document.getElementById('btnCargarMateriales').addEventListener('click', async () => {
  try{
    const res = await fetch('api/materiales.json');
    if (!res.ok) throw new Error("Error al obtener materiales");
    const materiales = await res.json();
    
      materiales.forEach(m => {
        const material = new Material(m.nombre, m.precioUnitario, m.cantidad, "unidad", 1);
        calculadora.agregarMaterial(material);
      });

      guardarDatosEnStorage();
      actualizarTablaMateriales();

      const costos = materiales.map(m => m.precioUnitario * m.cantidad);
      const total = costos.reduce((acc, val) => acc + val, 0);

      Swal.fire({
        icon: 'info',
        title: 'Materiales cargados',
        text: `Se importaron materiales por un total de $${total}`,
        confirmButtonText: 'Aceptar'
      });

    }catch(error){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudieron cargar los materiales: ${error.message}`
      });
    }
    });

document.getElementById('btnCargarGastos').addEventListener('click', async () => {
  try{
    const res = await fetch('api/gastos.json');
    if (!res.ok) throw new Error("Error al obtener gastos fijos");
    const gastos = await res.json();
    gastos.forEach(g => {
      calculadora.agregarGastoFijo(g.concepto, g.costo);
      });

      guardarDatosEnStorage();
      actualizarTablaGastosFijos();

      const total = gastos.reduce((acc, g) => acc + g.costo, 0);

      Swal.fire({
        icon: 'info',
        title: 'Gastos cargados',
        text: `Se importaron gastos por un total de $${total}`,
        confirmButtonText: 'Aceptar'
      });

    }catch(error){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudieron cargar los gastos: ${error.message}`
      });
    }
});
