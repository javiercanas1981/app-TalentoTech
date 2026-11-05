import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { NotificationProvider } from "./NotificationProvider";
import { useNotification } from "./useNotification";

function NotificationActions() {
  const { showError, showSuccess, showWarning, showInfo } = useNotification();

  return (
    <>
      <button onClick={() => showError("Error de prueba")}>Error</button>
      <button onClick={() => showSuccess("Éxito de prueba")}>Éxito</button>
      <button onClick={() => showWarning("Aviso de prueba")}>Aviso</button>
      <button onClick={() => showInfo("Info de prueba")}>Info</button>
    </>
  );
}

afterEach(() => {
  cleanup();
});

describe("NotificationProvider", () => {
  test.each([
    ["Error", "Error de prueba", "snackbar-error"],
    ["Éxito", "Éxito de prueba", "snackbar-success"],
    ["Aviso", "Aviso de prueba", "snackbar-warning"],
    ["Info", "Info de prueba", "snackbar-info"],
  ])("shows %s notifications and dismisses them", (button, message, className) => {
    render(
      <NotificationProvider>
        <NotificationActions />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: button }));
    expect(screen.getByText(message).parentElement).toHaveClass(className);

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });
});
