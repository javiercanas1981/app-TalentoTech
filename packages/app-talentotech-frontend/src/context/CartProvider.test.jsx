import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CartProvider } from "./CartProvider";
import { useCart } from "./useCart";

function CartActions({ product }) {
  const { addToCart, getAvailableStock, getItemQuantity, updateQuantity } =
    useCart();

  return (
    <>
      <button onClick={() => addToCart(product)}>Agregar</button>
      <button onClick={() => updateQuantity(product.id, 3)}>Pedir tres</button>
      <output data-testid="quantity">{getItemQuantity(product.id)}</output>
      <output data-testid="available">{getAvailableStock(product)}</output>
    </>
  );
}

describe("CartProvider stock limits", () => {
  test("prevents adding or setting a quantity above available stock", () => {
    const product = { id: "product-1", stock: 2 };

    render(
      <CartProvider>
        <CartActions product={product} />
      </CartProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(screen.getByTestId("quantity")).toHaveTextContent("2");
    expect(screen.getByTestId("available")).toHaveTextContent("0");

    fireEvent.click(screen.getByRole("button", { name: "Pedir tres" }));
    expect(screen.getByTestId("quantity")).toHaveTextContent("2");
  });
});
