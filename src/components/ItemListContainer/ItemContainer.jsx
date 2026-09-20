import { useEffect, useState } from "react";
import { getProducts } from "../../services/ProductService";

import Item from "../Item/Item";
import "./ItemContainer.css";

/**
 * Contenedor encargado de obtener y mostrar la lista de productos.
 *
 * Carga los productos mediante `getProducts` al montar el componente
 * y los almacena en el estado local. Cada producto se renderiza
 * mediante un componente `Item`.
 *
 * @returns {JSX.Element} Grilla con los productos disponibles.
 */
function ItemContainer() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        console.log("Productos:", data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
      });
  }, []);

  return (
    <div className="product-grid">
      {products.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ItemContainer;
