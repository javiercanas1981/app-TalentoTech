import { createContext } from "react";

/**
 * Proveedor del contexto del carrito.
 *
 * Centraliza el estado y las operaciones relacionadas
 * con los productos agregados al carrito.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export const CartContext = createContext(null);
