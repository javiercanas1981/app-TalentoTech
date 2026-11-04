import { describe, expect, jest, test } from "@jest/globals";
import { FirestoreOrderRepository } from "./FirestoreOrderRepository.js";

describe("FirestoreOrderRepository", () => {
  test("creates an order and decrements product stock in an Admin SDK transaction", async () => {
    const orderReference = { id: "order-1" };
    const productReference = { id: "product-1" };
    const productSnapshot = {
      exists: true,
      data: () => ({ name: "Apples", price: 12, stock: 5 }),
    };
    const transaction = {
      get: jest.fn(async (reference) =>
        reference === orderReference
          ? { exists: false }
          : productSnapshot,
      ),
      update: jest.fn(),
      set: jest.fn(),
    };
    const firestore = {
      collection: jest.fn((name) => ({
        doc: jest.fn((id) =>
          name === "orders" ? orderReference : productReference,
        ),
      })),
      runTransaction: jest.fn((callback) => callback(transaction)),
    };

    const order = await new FirestoreOrderRepository(firestore).create(
      [{ productId: "product-1", quantity: 2 }],
      "order-1",
    );

    expect(order).toMatchObject({
      id: "order-1",
      total: 24,
      status: "confirmed",
      items: [{ productId: "product-1", quantity: 2, subtotal: 24 }],
    });
    expect(transaction.update).toHaveBeenCalledWith(productReference, {
      stock: 3,
    });
    expect(transaction.set).toHaveBeenCalledWith(
      orderReference,
      expect.objectContaining({ id: "order-1", total: 24 }),
    );
  });
});
