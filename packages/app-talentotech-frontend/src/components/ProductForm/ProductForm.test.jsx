import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ProductForm from "./ProductForm";

describe("ProductForm price", () => {
  test("accepts and submits decimal prices", () => {
    const onSave = vi.fn();
    const { container } = render(
      <ProductForm onSave={onSave} onCancel={vi.fn()} />,
    );
    const priceInput = screen.getByLabelText("Precio *");

    fireEvent.change(priceInput, { target: { value: "12.75" } });
    fireEvent.submit(container.querySelector("form"));

    expect(priceInput.step).toBe("any");
    expect(priceInput.validity.stepMismatch).toBe(false);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ price: 12.75 }),
    );
  });
});
