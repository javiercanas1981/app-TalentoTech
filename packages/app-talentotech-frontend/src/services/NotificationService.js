let listener = null;

/**
 * Servicio de notificaciones de la aplicación.
 *
 * Permite publicar notificaciones desde cualquier parte de la aplicación
 * sin necesidad de pasar callbacks mediante props.
 *
 * El componente encargado de mostrar las notificaciones puede suscribirse
 * mediante `subscribe` y recibir notificaciones generadas por los métodos
 * `showError`, `showSuccess`, `showWarning` y `showInfo`.
 *
 * `subscribe` recibe un callback que será ejecutado cada vez que se genere
 * una notificación y devuelve una función para cancelar la suscripción.
 *
 * @namespace notificationService
 */
export const notificationService = {
  subscribe(callback) {
    listener = callback;

    return () => {
      listener = null;
    };
  },

  showError(message) {
    if (listener) {
      listener({
        severity: "error",
        message,
      });
    }
  },

  showSuccess(message) {
    if (listener) {
      listener({
        severity: "success",
        message,
      });
    }
  },

  showWarning(message) {
    if (listener) {
      listener({
        severity: "warning",
        message,
      });
    }
  },

  showInfo(message) {
    if (listener) {
      listener({
        severity: "info",
        message,
      });
    }
  },
};
