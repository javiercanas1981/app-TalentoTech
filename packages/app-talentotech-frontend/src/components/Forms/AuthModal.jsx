import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Forms.css";

function AuthModal({ children, initialTab, backgroundLocation }) {
  const location = useLocation();
  const navigate = useNavigate();

  const closeModal = useCallback(() => {
    navigate(backgroundLocation ?? "/", { replace: true });
  }, [backgroundLocation, navigate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  const switchTab = (tab) => {
    navigate(tab === "register" ? "/register" : "/login", {
      state: location.state,
      replace: true,
    });
  };

  return (
    <div
      className="auth-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Autenticación"
      >
        <button
          type="button"
          className="auth-modal-close"
          aria-label="Cerrar"
          onClick={closeModal}
        >
          ×
        </button>
        <div className="auth-modal-tabs" role="tablist" aria-label="Acceso">
          <button
            type="button"
            role="tab"
            aria-selected={initialTab === "login"}
            className={initialTab === "login" ? "active" : ""}
            onClick={() => switchTab("login")}
          >
            Ingreso
          </button>
          <span aria-hidden="true" />
          <button
            type="button"
            role="tab"
            aria-selected={initialTab === "register"}
            className={initialTab === "register" ? "active" : ""}
            onClick={() => switchTab("register")}
          >
            Registro
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default AuthModal;
