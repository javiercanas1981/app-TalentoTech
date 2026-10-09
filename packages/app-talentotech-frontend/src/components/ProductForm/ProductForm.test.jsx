import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import ProductForm from "./ProductForm";

afterEach(() => {
  cleanup();
});

describe("ProductForm price", () => {
  test("submits product fields matching the API contract", () => {
    const onSave = vi.fn();
    const { container } = render(
      <ProductForm onSave={onSave} onCancel={vi.fn()} />,
    );

    fireEvent.submit(container.querySelector("form"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        weight: "",
        image: "",
        description: "",
        cookingTip: "",
        isFeatured: false,
      }),
    );
    expect(onSave.mock.calls[0][0]).not.toHaveProperty("imagePath");
    expect(onSave.mock.calls[0][0]).not.toHaveProperty("desc");
    expect(onSave.mock.calls[0][0]).not.toHaveProperty("coockingTip");
    expect(onSave.mock.calls[0][0]).not.toHaveProperty("isFeature");
  });

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
