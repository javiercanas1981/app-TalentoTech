import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./Forms.css";

function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(email.trim(), password);
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (signInError) {
      setError(
        signInError.message ||
          "No se pudo iniciar sesión. Revisa tus credenciales e intenta nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="login-form-container auth-card"
      aria-labelledby="login-title"
    >
      <h1 id="login-title">Iniciar sesión</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Correo electrónico</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="auth-form-footer">
        ¿No tienes una cuenta? <Link to="/register">Crear cuenta</Link>
      </p>
    </section>
  );
}

export default LoginForm;