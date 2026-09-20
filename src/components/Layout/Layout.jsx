import Footer from "../Footer/Footer";
import Header from "../Header/Header";

/**
 * Layout principal de la aplicación.
 *
 * Define la estructura común de las páginas incluyendo
 * el encabezado, el contenido principal y el pie de página.
 *
 * El contenido específico de cada página se recibe mediante
 * la prop `children`.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido de la página.
 *
 * @returns {JSX.Element} Estructura principal de la aplicación.
 */
export const Layout = ({ children }) => {
  return (
    <div>
      <Header />

      <main>{children}</main>

      <Footer />
    </div>
  );
};
