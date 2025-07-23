# Anexo - ExpressJS

## Descripción general

ExpressJS es un framework minimalista para Node.js que permite desarrollar servidores web y APIs de forma rápida y sencilla. Se considera uno de los frameworks más populares en el backend de JavaScript debido a su simplicidad, flexibilidad y compatibilidad con múltiples bases de datos y herramientas.

Utiliza una estructura basada en rutas y middlewares, lo que permite una gran personalización y control del flujo de la aplicación.

## Propósito y características destacadas

- Permite crear servidores web y APIs REST de manera eficiente.
- Fácil de integrar con bases de datos como MongoDB, MySQL o PostgreSQL.
- Soporte de middlewares para autenticación, validaciones, etc.
- Código simple y legible, ideal para proyectos escalables.

## Motivación y justificación

En el contexto del proyecto “CostoPro”, Express permitiría sustituir el uso de `localStorage` por una API backend que administre los materiales y gastos de forma persistente. Esto sería fundamental si se quisiera evolucionar hacia una aplicación multiusuario, con login, almacenamiento en base de datos y comunicación mediante HTTP.

También facilitaría la integración con herramientas de análisis, seguridad y validación de datos del lado del servidor.

## Nivel de dificultad y curva de aprendizaje

La curva de aprendizaje de ExpressJS es considerada baja, especialmente si ya se conocen las bases de JavaScript. Su sintaxis es directa y la comunidad ofrece numerosos ejemplos y buenas prácticas.

Las únicas barreras iniciales suelen estar relacionadas con la instalación de Node.js y la estructura del proyecto.

### Ejemplo de código - "Antes y después":

**JavaScript puro (actual):**
```
const materiales = JSON.parse(localStorage.getItem("materiales")) || [];
```
**Con Express (backend):**
```
// server.js
app.get("/api/materiales", (req, res) => {
  // lógica para traer materiales desde una base de datos
  res.json(materiales);
});
```
**Con fetch (frontend):**
```
fetch("/api/materiales")
  .then((res) => res.json())
  .then((data) => {
    // mostrar los materiales en pantalla
  });
  ```