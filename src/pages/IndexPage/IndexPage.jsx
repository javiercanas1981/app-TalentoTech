import ItemListContainer from "../../components/ItemListContainer/ItemContainer";

/**
 * Página principal del catálogo de productos.
 *
 * Visualiza el mensaje de bienvenida y el listado de productos disponibles en el catálogo.
 *
 * @returns {JSX.Element} Página principal del catálogo.
 */
function IndexPage() {
  return (
    <div>
      <h1>Bienvenido</h1>

      <p>Catálogo de productos.</p>

      <ItemListContainer />
    </div>
  );
}

export default IndexPage;
