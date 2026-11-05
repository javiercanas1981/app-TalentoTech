import { useState } from "react";
import ItemListContainer from "../../components/ItemListContainer/ItemContainer";

/**
 * Página principal del catálogo de productos.
 *
 * Visualiza el mensaje de bienvenida y el listado de productos disponibles en el catálogo.
 *
 * @returns {JSX.Element} Página principal del catálogo.
 */
function IndexPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    if (!value.trim()) setSearchTerm("");
  };

  return (
    <div className="catalog-page">
      <section className="catalog-hero">
        <div>
          <p className="catalog-eyebrow">Calidad para tu mesa</p>
          <h1>Bienvenido a TalentoTech</h1>
          <p>Encontrá tus favoritos y recibí todo lo que necesitás en casa.</p>
        </div>
        <a className="catalog-cta" href="#productos">
          Explorar productos
        </a>
      </section>
      <form className="catalog-search" role="search" onSubmit={handleSearch}>
        <svg
          className="catalog-search-icon"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
        <input
          id="catalog-search-input"
          className="catalog-search-input"
          type="search"
          aria-label="Buscar productos"
          placeholder="Buscar productos..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <button className="catalog-search-button" type="submit">
          Buscar
        </button>
      </form>
      <section aria-labelledby="catalog-title">
        <div className="catalog-section-heading">
          <h2 id="catalog-title">Descubrí nuestros productos</h2>
          <p>Elegí, agregá al carrito y comprá en pocos pasos.</p>
        </div>
        <ItemListContainer key={searchTerm} searchTerm={searchTerm} />
      </section>
    </div>
  );
}

export default IndexPage;
