import { afterEach, describe, expect, test, vi } from "vitest";
import {
  createOrder,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./ProductService";

const product = { id: "prod 1", name: "Asado", stock: 6 };

function mockResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    statusText: "Request failed",
    text: vi.fn().mockResolvedValue(body == null ? "" : JSON.stringify(body)),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ProductService", () => {
  test("loads the collection and a single product from the API", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse([product]))
      .mockResolvedValueOnce(mockResponse(product));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getProducts()).resolves.toEqual([product]);
    await expect(getProduct(product.id)).resolves.toEqual(product);

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/products", undefined);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/products/prod%201",
      undefined,
    );
  });

  test("creates, updates, and deletes products through the API", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse(product, { status: 201 }))
      .mockResolvedValueOnce(mockResponse(product))
      .mockResolvedValueOnce(mockResponse({ id: product.id, deleted: true }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(createProduct(product)).resolves.toEqual(product);
    await expect(updateProduct(product.id, product)).resolves.toEqual(product);
    await expect(deleteProduct(product.id)).resolves.toEqual({
      id: product.id,
      deleted: true,
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    expect(fetchMock.mock.calls[1][1].method).toBe("PUT");
    expect(fetchMock.mock.calls[2][1].method).toBe("DELETE");
  });

  test("submits order lines and an idempotency key without client-side prices", async () => {
    const items = [{ productId: product.id, quantity: 2 }];
    const idempotencyKey = "request-key-000001";
    const order = { id: "order-1", total: 25000, status: "confirmed" };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse(order, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(createOrder(items, idempotencyKey)).resolves.toEqual(order);
    expect(fetchMock).toHaveBeenCalledWith("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, idempotencyKey }),
    });
  });

  test("surfaces API errors instead of treating them as successful responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse(
          { statusCode: 400, message: "'stock' must be an integer" },
          { ok: false, status: 400 },
        ),
      ),
    );

    await expect(createProduct(product)).rejects.toThrow(
      "400): 'stock' must be an integer",
    );
  });
});
