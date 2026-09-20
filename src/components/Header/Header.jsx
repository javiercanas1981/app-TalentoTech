import { Link } from "react-router-dom";
import "./Header.css";

/**
 * Visualiza la cabecera principal de la aplicación.
 *
 * Incluye el logo de la aplicación y los enlaces de navegación
 * hacia la administración de productos, el catálogo y el carrito.
 *
 * @returns {JSX.Element} Cabecera con el logo y la navegación principal.
 */
function Header() {
  return (
    <header className="header">
      <div className="header-logo__container">
        <Link to="/" className="header-logo-link">
          <img
            src="/assets/logo_transparent.png"
            alt="Simple Code Logo"
            className="header-logo-img"
          />
        </Link>
      </div>
      <nav className="header-navigation">
        <Link to="/admin/productos">Admin</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/carrito">Carrito</Link>
      </nav>
    </header>
  );
}

export default Header;
