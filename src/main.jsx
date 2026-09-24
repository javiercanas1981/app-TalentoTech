import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import "./index.css";

/**
 * Punto de entrada de la aplicación React.
 * Configura los providers globales de la aplicación:
 * - BrowserRouter: navegación y enrutamiento.
 * - CartProvider: estado global del carrito.
 * La aplicación se monta dentro de StrictMode para detectar
 * posibles problemas durante el desarrollo.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
