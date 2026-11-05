import { useCallback, useMemo, useState } from "react";
import SnackBar from "../components/SnackBar/SnackBar";
import { NotificationContext } from "./NotificationContext";

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((severity, message) => {
    setNotification({ severity, message });
  }, []);

  const showError = useCallback(
    (message) => showNotification("error", message),
    [showNotification],
  );
  const showSuccess = useCallback(
    (message) => showNotification("success", message),
    [showNotification],
  );
  const showWarning = useCallback(
    (message) => showNotification("warning", message),
    [showNotification],
  );
  const showInfo = useCallback(
    (message) => showNotification("info", message),
    [showNotification],
  );
  const closeNotification = useCallback(() => setNotification(null), []);

  const value = useMemo(
    () => ({ showError, showSuccess, showWarning, showInfo }),
    [showError, showSuccess, showWarning, showInfo],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <SnackBar
        open={Boolean(notification)}
        message={notification?.message ?? ""}
        severity={notification?.severity}
        onClose={closeNotification}
      />
    </NotificationContext.Provider>
  );
}
