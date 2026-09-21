import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { Layout } from "./components/Layout/Layout";
import { CartProvider } from "./context/CartProvider";

import CartPage from "./pages/CartPage/CartPage";
import IndexPage from "./pages/IndexPage/IndexPage";
import ProductAdminPage from "./pages/ProductAdminPage/ProductAdminPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";

/**
 * Componente primario de la aplicación.
 *
 * Configura el sistema de navegación mediante React Router,
 * proporciona el contexto global del carrito y establece el
 * layout común utilizado por las distintas páginas.
 *
 * Define las rutas principales de la aplicación:
 * - Página de inicio.
 * - Detalle de producto.
 * - Carrito de compras.
 * - Administración de productos.
 *
 * Por default se redirigen automáticamente a la página de inicio.
 *
 * @returns {JSX.Element} Estructura principal de la aplicación.
 */
function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<IndexPage />} />

            <Route path="/producto/:id" element={<ProductDetailPage />} />

            <Route path="/carrito" element={<CartPage />} />

            {/* Administración de productos */}
            <Route path="/admin/productos" element={<ProductAdminPage />} />

            {/* fuerza redirigir al inicio para cualquier ruta que no exista*/}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
