import { describe, expect, test, jest } from "@jest/globals";
import { ProductValidationError } from "../errors/ProductValidationError.js";
import { OrderUseCase } from "./OrderUseCase.js";

describe("OrderUseCase", () => {
  test("validates items and combines repeated product IDs before creating an order", async () => {
    const create = jest.fn().mockResolvedValue({ id: "order-1" });
    const useCase = new OrderUseCase({ create });

    await expect(
      useCase.execute({
        idempotencyKey: "request-key-000001",
        items: [
          { productId: "prod-1", quantity: 2 },
          { productId: " prod-1 ", quantity: 1 },
          { productId: "prod-2", quantity: 3 },
        ],
      }),
    ).resolves.toEqual({ id: "order-1" });

    expect(create).toHaveBeenCalledWith(
      [
        { productId: "prod-1", quantity: 3 },
        { productId: "prod-2", quantity: 3 },
      ],
      "request-key-000001",
    );
  });

  test.each([
    undefined,
    null,
    {},
    { idempotencyKey: "request-key-000001", items: [] },
    {
      idempotencyKey: "request-key-000001",
      items: [{ productId: "", quantity: 1 }],
    },
    {
      idempotencyKey: "request-key-000001",
      items: [{ productId: "prod-1", quantity: 0 }],
    },
    {
      idempotencyKey: "request-key-000001",
      items: [{ productId: "prod-1", quantity: 1.5 }],
    },
    {
      idempotencyKey: "request-key-000001",
      items: [
        { productId: "prod-1", quantity: Number.MAX_SAFE_INTEGER },
        { productId: "prod-1", quantity: 1 },
      ],
    },
    {
      idempotencyKey: "bad key",
      items: [{ productId: "prod-1", quantity: 1 }],
    },
  ])("rejects invalid order payload %#", async (payload) => {
    const create = jest.fn();
    const useCase = new OrderUseCase({ create });

    await expect(useCase.execute(payload)).rejects.toBeInstanceOf(
      ProductValidationError,
    );
    expect(create).not.toHaveBeenCalled();
  });
});
