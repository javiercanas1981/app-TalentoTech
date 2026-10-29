import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading, authError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <p className="auth-status" role="status">
        Verificando sesión...
      </p>
    );
  }

  if (authError) {
    return (
      <p className="auth-error" role="alert">
        {authError}
      </p>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          backgroundLocation:
            location.state?.backgroundLocation ?? { pathname: "/" },
        }}
      />
    );
  }

  return children;
}
