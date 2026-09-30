import "./Footer.css";

/**
 * Visualiza el pie la pagina de la aplicación.
 *
 * Incluye la leyenda de copyright de la aplicación y los enlaces de navegación a redes sociales.
 *
 * @returns {JSX.Element} Pie de pagina de la aplicación.
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-social">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>

          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
            Facebook
          </a>

          <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
            YouTube
          </a>

          <a href="https://x.com" target="_blank" rel="noreferrer">
            X
          </a>
        </div>

        <div className="footer-info">
          <a href="https://www.google.com" target="_blank" rel="noreferrer">
            www.carrito.me
          </a>

          <a href="https://www.google.com" target="_blank" rel="noreferrer">
            www.carrito.compra
          </a>
        </div>

        <p>© 2026 Javier Cañas - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;
