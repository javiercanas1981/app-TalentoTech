import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "./Header.css";

/**
 * Visualiza la cabecera principal de la aplicación.
 *
 * Incluye el logo de la aplicación y los enlaces de navegación
 * hacia la administración de productos, el catálogo y el carrito.
 *
 * @returns {JSX.Element} Cabecera con el logo y la navegación principal.
 */
function Header({ category = "" }) {
  const { totalItemCount } = useCart();

  return (
    <header className="header">
      <Link to="/" className="header-logo-link" aria-label="Ir al catálogo">
        <img
          src="/assets/logo_transparent.png"
          alt="Logo de la aplicación"
          className="header-logo-img"
        />
      </Link>
      <div className="header-content">
        <span className="header-category">{category || "Catálogo"}</span>
        <nav className="header-navigation" aria-label="Navegación principal">
          <Link to="/#productos">Productos</Link>
          <NavLink to="/admin/productos">Panel</NavLink>
          <NavLink
            to="/carrito"
            className="header-cart-link"
            aria-label={`Carrito, ${totalItemCount} productos`}
          >
            <svg
              className="header-cart-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M3 3h2l2.2 11.1a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="10" cy="19" r="1" />
              <circle cx="18" cy="19" r="1" />
            </svg>
            <span>{totalItemCount}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
