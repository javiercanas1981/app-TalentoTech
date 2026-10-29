import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./Forms.css";

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(email.trim(), password, name.trim());
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (registrationError) {
      setError(
        registrationError.message ||
          "No se pudo crear la cuenta. Intenta nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="register-form-container auth-card"
      aria-labelledby="register-title"
    >
      <h1 id="register-title">Crear cuenta</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="register-name">Nombre</label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <label htmlFor="register-email">Correo electrónico</label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="register-password">Contraseña</label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          minLength={6}
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
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <p className="auth-form-footer">
        ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </section>
  );
}

export default RegisterForm;