import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
export const Layout = () => {
  const location = useLocation();
  const [categoryState, setCategoryState] = useState(null);
  const setHeaderCategory = useCallback(
    (category) => {
      setCategoryState({ pathname: location.pathname, category });
    },
    [location.pathname],
  );
  const category =
    categoryState?.pathname === location.pathname
      ? categoryState.category
      : "";

  return (
    <div>
      <Header category={category} />

      <main>
        <Outlet context={{ setHeaderCategory }} />
      </main>

      <Footer />
    </div>
  );
};
