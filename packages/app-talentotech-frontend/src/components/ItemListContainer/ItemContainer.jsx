import { useEffect, useState } from "react";
import { notificationService } from "../../services/NotificationService";
import { getProducts } from "../../services/ProductService";
import Item from "../Item/Item";
import "./ItemContainer.css";

const PAGE_SIZE = 8;

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
  const [pageData, setPageData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProducts({ page, size: PAGE_SIZE })
      .then((data) => {
        if (active) setPageData(data);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        notificationService.showError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page]);

  const changePage = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  return (
    <>
      <div className="product-grid" id="productos" aria-live="polite">
        {pageData.content.map((product) => (
          <Item key={product.id} product={product} />
        ))}
        {!loading && pageData.totalElements === 0 && (
          <p className="product-grid-empty">No hay productos disponibles.</p>
        )}
      </div>
      {pageData.totalPages > 1 && (
        <nav className="pagination" aria-label="Paginación de productos">
          <button
            type="button"
            className="pagination-button"
            onClick={() => changePage(page - 1)}
            disabled={page === 0 || loading}
          >
            Anterior
          </button>
          <span className="pagination-status" aria-live="polite">
            Página {page + 1} de {pageData.totalPages}
            <span className="pagination-total">
              {" "}
              · {pageData.totalElements} productos
            </span>
          </span>
          <button
            type="button"
            className="pagination-button"
            onClick={() => changePage(page + 1)}
            disabled={!pageData.hasNext || loading}
          >
            Siguiente
          </button>
        </nav>
      )}
    </>
  );
}

export default ItemContainer;
