import "./SnackBar.css";

function SnackBar({ open, message, severity = "error", onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className={`snackbar snackbar-${severity}`}>
      <span className="snackbar-message">{message}</span>

      <button
        type="button"
        className="snackbar-close"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  );
}

export default SnackBar;
