import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * Punto de entrada de la aplicación React.
 *
 * Obtiene el elemento raíz del DOM y monta el componente `App`
 * dentro de `StrictMode` para detectar posibles problemas
 * durante el desarrollo.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
