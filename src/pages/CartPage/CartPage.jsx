import { useCart } from "../../context/useCart";
import "./CartPage.css";

/**
 * Visualiza la pagina del carrito donde se detallan el\los productos y permite que el usuario pueda añadirlo al carrito.
 *
 * Obtiene los productos seleccionados mediante el hook `useCart`
 * y permite modificar sus cantidades, eliminar productos
 * y finalizar la compra.
 *
 * El contenido se divide en dos secciones:
 * - Lista de productos seleccionados y sus cantidades.
 * - Resumen de la compra con subtotal y total.
 *
 * @returns {JSX.Element} Página del carrito con los productos y su resumen.
 */
function CartPage() {
  const { items, subtotal, removeFromCart, clearCart, updateQuantity } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Mi carrito</h1>
        <div className="empty-cart-msg">
          <p>El carrito está vacío.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Mi Carrito</h1>

      <div className="cart-content">
        {/* Columna Izquierda: Productos */}
        <section className="cart-items-list">
          {items.map((item) => {
            const itemTotal = item.product.price * item.quantity;

            return (
              <div className="cart-item" key={item.product.id}>
                <img
                  src={
                    item.product.image || "https://via.placeholder.com/90x70"
                  }
                  alt={item.product.name}
                  className="cart-item-img"
                />

                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                </div>

                <div className="cart-item-quantity">
                  {item.editable ? (
                    <button className="edit-btn" aria-label="Editar">
                      ✏️
                    </button>
                  ) : (
                    <>
                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>

                      <span className="cart-qty-number">{item.quantity}</span>

                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </>
                  )}
                </div>

                <div className="cart-item-price-col">
                  <span className="cart-item-price">
                    $
                    {itemTotal.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* Columna Derecha: Resumen de la compra */}
        <aside className="cart-summary-card">
          <h2 className="summary-title">Resumen de la compra</h2>

          <div className="summary-row discount">
            <span>Descuentos:</span>
            <span>$0.00</span>
          </div>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>
              ${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <hr className="summary-divider" />

          <div className="summary-total-row">
            <span>TOTAL:</span>
            <span>
              ${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button className="checkout-btn" onClick={clearCart}>
            FINALIZAR COMPRA
          </button>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
