import { useContext } from "react";
import { CartContext } from "./CartContext";

/**
 * Hook customizado para acceder al contexto del carrito.
 *
 * @returns {CartContextValue} Estado y operaciones del carrito.
 * @throws {Error} Si se utiliza fuera de un CartProvider.
 */
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }

  return context;
};
