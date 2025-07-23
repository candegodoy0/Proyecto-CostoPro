# Anexo - React

## Descripción general

React es una biblioteca de JavaScript desarrollada por Facebook para la construcción de interfaces de usuario. Su principal objetivo es facilitar el desarrollo de aplicaciones interactivas y escalables, mediante un enfoque basado en componentes reutilizables y el uso de un DOM virtual que mejora el rendimiento.

Es ampliamente adoptado en la industria debido a su flexibilidad, rendimiento y comunidad activa. Utiliza una sintaxis llamada JSX, que permite escribir componentes mezclando JavaScript con estructuras similares a HTML.

## Propósito y características destacadas

- Creación de interfaces dinámicas mediante componentes reutilizables.
- Actualización eficiente del DOM a través del Virtual DOM.
- Facilita el desarrollo modular y la escalabilidad del código.
- Ecosistema robusto, con herramientas adicionales como React Router y Redux.

## Motivación y justificación

React sería especialmente útil en el proyecto “CostoPro” para modularizar elementos como formularios, tablas de resultados y mensajes de alerta. También permitiría una mejor gestión del estado, reemplazando estructuras manuales de `localStorage` por herramientas internas como `useState` o `useReducer`.

Además, su enfoque declarativo facilitaría la comprensión y mantenimiento del código a largo plazo.

## Nivel de dificultad y curva de aprendizaje

Si bien React presenta conceptos novedosos para quienes vienen del desarrollo en JS puro (como Hooks, estado o props), su curva de aprendizaje es considerada moderada, especialmente gracias a su abundante documentación oficial y una gran cantidad de tutoriales gratuitos.

### Ejemplo de código - "Antes y después":

**JavaScript puro (actual)**
```
const boton = document.getElementById("calcular");
boton.addEventListener("click", () => {
  // lógica de cálculo
});
```
**Con React:**
```
function BotonCalcular() {
  const handleClick = () => {
    const materiales = obtenerMateriales();
    const total = calcularTotal(materiales);
    setResultado(total);
  };
  return <button onClick={handleClick}>Calcular</button>;
}
```
