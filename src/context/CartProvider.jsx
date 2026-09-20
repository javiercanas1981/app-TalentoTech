import { useState } from "react";
import { CartContext } from "./CartContext";

/**
 * Proveedor del contexto del carrito.
 *
 * Centraliza el estado y las operaciones relacionadas
 * con los productos agregados al carrito.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  /**
   * Agrega un producto al carrito.
   *
   * @param {Object} product - Producto a agregar.
   * @param {number} [quantity=1] - Cantidad a agregar.
   * @returns {void}
   */
  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...prevItems,
        {
          product,
          quantity,
        },
      ];
    });
  };

  /**
   * Elimina un producto del carrito.
   *
   * @param {string} productId - Identificador del producto a eliminar.
   * @returns {void}
   */
  const removeFromCart = (productId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  /**
   * Actualiza el estado del carrito.
   *
   * @param {string} productId - Identificador del producto.
   * @param {number} quantity - Cantidad que va actualizar para arriba o para abajo.
   * @returns {void}
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId) => {
    return items.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = items.find((item) => item.product.id === productId);

    return item?.quantity ?? 0;
  };

  const totalItemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        isInCart,
        getItemQuantity,

        totalItemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
