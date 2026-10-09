import { useState } from "react";
import { useCart } from "../../context/useCart";
import { notificationService } from "../../services/NotificationService";
import { createOrder } from "../../services/ProductService";
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
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [checkoutAttempt, setCheckoutAttempt] = useState(null);
  const checkoutLocked = checkoutPending || checkoutAttempt?.uncertain;

  const handleCheckout = async () => {
    const currentItems = items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    }));
    const cartSignature = JSON.stringify(currentItems);
    const attempt = checkoutAttempt?.uncertain
      ? checkoutAttempt
      : checkoutAttempt?.cartSignature === cartSignature
        ? checkoutAttempt
        : {
            cartSignature,
            idempotencyKey: globalThis.crypto.randomUUID(),
            items: currentItems,
          };

    setCheckoutAttempt(attempt);
    setCheckoutPending(true);
    try {
      const order = await createOrder(attempt.items, attempt.idempotencyKey);
      clearCart();
      setCheckoutAttempt(null);
      setConfirmedOrder(order);
      notificationService.showSuccess(
        `Pedido registrado. Número de orden: ${order.id}`,
      );
    } catch (error) {
      console.error("Error confirmando la compra:", error);
      notificationService.showError(
        `No se pudo confirmar la compra. ${error.message}`,
      );
      if ([400, 404, 409].includes(error.status)) {
        setCheckoutAttempt(null);
      } else {
        setCheckoutAttempt({ ...attempt, uncertain: true });
      }
    } finally {
      setCheckoutPending(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="cart-container">
        <div className="empty-cart-msg">
          <h1>Pedido confirmado</h1>
          <p>Tu pedido quedó registrado y el stock fue actualizado.</p>
          <p>El pago no se procesa desde esta aplicación.</p>
          <p>
            Número de orden: <strong>{confirmedOrder.id}</strong>
          </p>
          <p>
            Total:{" "}
            <strong>
              $
              {confirmedOrder.total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </p>
        </div>
      </div>
    );
  }

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
                        disabled={checkoutLocked}
                        aria-label="Reducir cantidad"
                      >
                        -
                      </button>

                      <span className="cart-qty-number">{item.quantity}</span>

                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={
                          checkoutLocked ||
                          item.quantity >= (item.product.stock ?? 0)
                        }
                        aria-label="Aumentar cantidad"
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
                    disabled={checkoutLocked}
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

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={checkoutPending}
          >
            {checkoutPending
              ? "PROCESANDO COMPRA..."
              : checkoutAttempt?.uncertain
                ? "REINTENTAR CONFIRMACIÓN"
                : "FINALIZAR COMPRA"}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
