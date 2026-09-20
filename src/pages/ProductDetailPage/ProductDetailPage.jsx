import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { getProduct } from "../../services/ProductService";
import "./ProductDetailPage.css";

/**
 * Visualiza el detalle de un producto y permite que el usuario pueda añadirlo al carrito.
 *
 * Obtiene el identificador del producto desde los parámetros de la URL (queryString),
 * carga desde el servicio sus datos y muestra su información, precio, valoración y stock.
 *
 * @returns {JSX.Element} Página con el detalle del producto.
 */
function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const { addToCart, removeFromCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error cargando producto:", error);
      });
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail-container">
        <p className="product-detail-loading">Cargando producto...</p>
      </div>
    );
  }

  const productInCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        {/* Imagen */}
        <div className="product-detail-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        {/* Información */}
        <div className="product-detail-info">
          <span className="product-detail-category">Producto</span>

          <h1 className="product-detail-title">{product.name}</h1>

          {/* Rating */}
          <div className="product-detail-rating">
            <span className="rating-stars">★★★★★</span>

            <span className="rating-value">{product.rating}</span>
          </div>

          {/* Precio */}
          <div className="product-detail-price">
            $
            {Number(product.price).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </div>

          {/* Descripción */}
          <p className="product-detail-description">{product.description}</p>

          {/* Información adicional */}
          <div className="product-detail-data">
            <div className="product-detail-data-item">
              <span>⚖️ Peso</span>
              <strong>{product.weight}</strong>
            </div>

            <div className="product-detail-data-item">
              <span>📦 Stock</span>
              <strong>Disponible</strong>
            </div>
          </div>

          <hr className="product-detail-divider" />

          {/* Carrito */}
          <div className="product-detail-cart">
            {productInCart && (
              <div className="product-detail-quantity">
                <span>Cantidad en carrito:</span>

                <strong>{quantity}</strong>
              </div>
            )}

            <button
              className="product-detail-add-btn"
              onClick={handleAddToCart}
            >
              {productInCart ? "AGREGAR OTRA UNIDAD" : "AGREGAR AL CARRITO"}
            </button>

            {productInCart && (
              <button
                className="product-detail-remove-btn"
                onClick={handleRemoveFromCart}
              >
                QUITAR DEL CARRITO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
