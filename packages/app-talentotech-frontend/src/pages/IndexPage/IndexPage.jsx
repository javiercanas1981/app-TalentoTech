import { useState } from "react";
import ItemListContainer from "../../components/ItemListContainer/ItemContainer";
import Search from "../../components/Search/Search";

/**
 * Página principal del catálogo de productos.
 *
 * Visualiza el mensaje de bienvenida y el listado de productos disponibles en el catálogo.
 *
 * @returns {JSX.Element} Página principal del catálogo.
 */
function IndexPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
      <Search onSearch={setSearchTerm} />
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
