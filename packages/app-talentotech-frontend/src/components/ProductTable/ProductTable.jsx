import { useState } from "react";
import "./ProductTable.css";

import { useEffect } from "react";
import { notificationService } from "../../services/NotificationService";
import { getProducts } from "../../services/productService";
import "./ProductTable.css";

/**
 * Tabla de administración de productos.
 *
 * Obtiene los productos mediante el servicio de productos
 * y permite crear, editar y eliminar productos mediante
 * las funciones recibidas desde el componente padre.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onNew - Función para crear un nuevo producto.
 * @param {Function} props.onEdit - Función para editar un producto.
 * @param {Function} props.onDelete - Función para eliminar un producto.
 *
 * @returns {JSX.Element} Tabla con el listado de productos.
 */
function ProductTable({ onNew, onEdit, onDelete }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error(error);
        notificationService.showError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <div className="product-table-container">
      <div className="product-table-header">
        <div>
          <h2>Productos</h2>
          <p>Administración de productos</p>
        </div>
        <button
          type="button"
          onClick={onNew}
          title="Añadir nuevo producto"
          aria-label="Añadir nuevo producto"
          className="product-new-button"
        >
          +
        </button>
      </div>

      {loading ? (
        <p className="product-table-message">Cargando productos...</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Unidad</th>
              <th>Rating</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>

                  <td>{product.category}</td>

                  <td>${product.price}</td>

                  <td>{product.unit}</td>

                  <td>{product.rating}</td>

                  <td>{product.isFeatured ? "Sí" : "No"}</td>

                  <td className="product-table-actions">
                    <button type="button" onClick={() => onEdit(product)}>
                      Editar
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="product-table-empty">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductTable;
