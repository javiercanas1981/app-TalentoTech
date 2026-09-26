import { Link, NavLink, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();
  const isProductSection =
    pathname === "/" || pathname.startsWith("/producto/");

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
        <NavLink to="/admin/productos">Admin</NavLink>
        <NavLink to="/" end className={isProductSection ? "active" : undefined}>
          Productos
        </NavLink>
        <NavLink to="/carrito">Carrito</NavLink>
      </nav>
    </header>
  );
}

export default Header;
