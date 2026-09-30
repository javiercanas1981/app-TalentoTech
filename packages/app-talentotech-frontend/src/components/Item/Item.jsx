import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/useCart";
import "./Item.css";

/**
 * Visualiza la Card de un producto del catálogo con la información principal del producto,
 * acceder a su página de detalle y gestionar la cantidad
 * del producto dentro del carrito.
 *
 * Si el producto no está en el carrito, permite agregarlo.
 * También permite aumentar, disminuir o eliminar su cantidad.
 *
 * El botón "Comprar" agrega el producto al carrito si todavía
 * no está agregado y navega a la página del carrito.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Product} props.product - Producto que se desea mostrar.
 *
 * @returns {JSX.Element} Card del producto.
 */
function Item({ product }) {
  const { addToCart, removeFromCart, updateQuantity, getItemQuantity } =
    useCart();

  const navigate = useNavigate();

  const quantity = getItemQuantity(product.id);

  const handleDecrease = () => {
    if (quantity === 1) {
      removeFromCart(product.id);
      return;
    }

    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity === 0) {
      addToCart(product);
      return;
    }

    updateQuantity(product.id, quantity + 1);
  };

  const handleGoToCart = (product) => {
    if (quantity === 0) {
      addToCart(product);
    }
    navigate("/carrito");
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Link to={`/producto/${product.id}`}>
          <img
            className="product-image"
            src={product.image}
            alt={product.name}
          />
        </Link>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <p className="product-description">Desc: {product.description}</p>

        <p className="product-price">Precio: ${product.price}</p>

        <div className="cart-item-controls">
          <p>Quitar/Añadir</p>

          <div className="quantity-controls">
            <button
              className="qty-btn"
              onClick={handleDecrease}
              disabled={quantity === 0}
            >
              -
            </button>

            <span className="qty-number">{quantity}</span>

            <button className="qty-btn" onClick={handleIncrease}>
              +
            </button>
          </div>

          <button
            className="product-detail-add-btn"
            onClick={() => handleGoToCart(product)}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Item;
