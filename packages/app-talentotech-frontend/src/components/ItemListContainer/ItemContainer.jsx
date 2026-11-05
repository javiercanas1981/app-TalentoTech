import { useEffect, useState } from "react";
import { useNotification } from "../../context/useNotification";
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
function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function ItemContainer({ searchTerm = "" }) {
  const [pageData, setPageData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    let active = true;
    const request = searchTerm
      ? getProducts().then((products) => {
          const normalizedTerm = normalizeSearchText(searchTerm);
          const content = products.filter((product) =>
            [
              product.name,
              product.category,
              product.description,
              ...(product.tags ?? []),
            ]
              .map(normalizeSearchText)
              .some((value) => value.includes(normalizedTerm)),
          );
          return {
            content,
            totalPages: 1,
            totalElements: content.length,
            hasNext: false,
          };
        })
      : getProducts({ page, size: PAGE_SIZE });

    request
      .then((data) => {
        if (active) setPageData(data);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        showError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, searchTerm, showError]);

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
          <p className="product-grid-empty">
            {searchTerm
              ? `No se encontraron productos para "${searchTerm}".`
              : "No hay productos disponibles."}
          </p>
        )}
      </div>
      {!searchTerm && pageData.totalPages > 1 && (
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
