import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import { Layout } from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import { useEffect, useState } from "react";
import AuthModal from "./components/Forms/AuthModal";
import LoginForm from "./components/Forms/LoginForm";
import RegisterForm from "./components/Forms/RegisterForm";
import SnackBar from "./components/SnackBar/SnackBar";
import CartPage from "./pages/CartPage/CartPage";
import IndexPage from "./pages/IndexPage/IndexPage";
import ProductAdminPage from "./pages/ProductAdminPage/ProductAdminPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import { notificationService } from "./services/NotificationService";
import { useAuth } from "./context/useAuth";

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
  const location = useLocation();
  const { user } = useAuth();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageSnackBar, setMessageSnackBar] = useState("");
  const [severity, setSeverity] = useState("error");
  const isAuthRoute = ["/login", "/register"].includes(location.pathname);
  const backgroundLocation = location.state?.backgroundLocation;
  const isAuthModalOpen = !user && isAuthRoute;
  const routesLocation = isAuthModalOpen
    ? (backgroundLocation ?? { pathname: "/", search: "", hash: "" })
    : location;

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(
      ({ message, severity }) => {
        setMessageSnackBar(message);
        setSeverity(severity);
        setOpenSnackBar(true);
      },
    );
    return unsubscribe;
  }, []);

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <>
      <Routes location={routesLocation}>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          {/* Administración de productos */}
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute>
                <ProductAdminPage />
              </ProtectedRoute>
            }
          />
          {/* fuerza redirigir al inicio para cualquier ruta que no exista*/}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      {isAuthModalOpen && (
        <AuthModal
          initialTab={location.pathname === "/register" ? "register" : "login"}
          backgroundLocation={backgroundLocation}
        >
          {location.pathname === "/register" ? <RegisterForm /> : <LoginForm />}
        </AuthModal>
      )}
      <SnackBar
        open={openSnackBar}
        message={messageSnackBar}
        severity={severity}
        onClose={handleCloseSnackBar}
      />
    </>
  );
}

export default App;
