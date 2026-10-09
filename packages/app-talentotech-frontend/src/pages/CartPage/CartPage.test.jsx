import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { CartProvider } from "../../context/CartProvider";
import { useCart } from "../../context/useCart";
import { createOrder } from "../../services/ProductService";
import CartPage from "./CartPage";

vi.mock("../../services/ProductService", () => ({
  createOrder: vi.fn(),
}));

const product = {
  id: "prod-1",
  name: "Asado",
  price: 100,
  stock: 5,
  image: "https://example.com/asado.jpg",
};

function AddProduct() {
  const { addToCart } = useCart();
  return (
    <button onClick={() => addToCart(product)}>Agregar producto de prueba</button>
  );
}

function renderCart() {
  return render(
    <CartProvider>
      <AddProduct />
      <CartPage />
    </CartProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("CartPage checkout", () => {
  test("registers the order and empties the cart only after confirmation", async () => {
    createOrder.mockResolvedValue({
      id: "order-1",
      total: 100,
      status: "confirmed",
    });
    renderCart();

    fireEvent.click(
      screen.getByRole("button", { name: "Agregar producto de prueba" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "FINALIZAR COMPRA" }));

    expect(createOrder).toHaveBeenCalledWith(
      [{ productId: "prod-1", quantity: 1 }],
      expect.stringMatching(/^[\w-]{16,128}$/),
    );
    expect(
      await screen.findByRole("heading", { name: "Pedido confirmado" }),
    ).toBeInTheDocument();
    expect(screen.getByText("order-1")).toBeInTheDocument();
  });

  test("keeps the cart and reuses the idempotency key after an uncertain failure", async () => {
    createOrder
      .mockRejectedValueOnce(new TypeError("Network error"))
      .mockResolvedValueOnce({
        id: "order-2",
        total: 100,
        status: "confirmed",
      });
    renderCart();

    fireEvent.click(
      screen.getByRole("button", { name: "Agregar producto de prueba" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "FINALIZAR COMPRA" }));

    const retryButton = await screen.findByRole("button", {
      name: "REINTENTAR CONFIRMACIÓN",
    });
    expect(screen.getByText("Asado")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Pedido confirmado" }),
    ).toBeNull();

    const originalAttempt = createOrder.mock.calls[0];
    fireEvent.click(retryButton);
    await screen.findByRole("heading", { name: "Pedido confirmado" });

    expect(createOrder).toHaveBeenCalledTimes(2);
    expect(createOrder.mock.calls[1][0]).toEqual(originalAttempt[0]);
    expect(createOrder.mock.calls[1][1]).toBe(originalAttempt[1]);
  });
});
