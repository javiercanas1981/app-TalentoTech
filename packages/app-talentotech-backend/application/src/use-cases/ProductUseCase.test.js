import { describe, expect, test } from "@jest/globals";
import { ProductNotFoundError } from "../errors/ProductNotFoundError.js";
import { ProductUseCase } from "./ProductUseCase.js";

const productInput = {
  name: "Asado de tira",
  category: "cortes",
  price: 12500,
  stock: 7,
  unit: "kg",
  weight: "1 kg aprox.",
  image: "https://example.com/asado.jpg",
  description: "Corte para parrilla",
  cookingTip: "Fuego medio",
  tags: ["Parrilla"],
  isFeatured: true,
};

function createRepository() {
  const products = new Map();
  return {
    products,
    getAll: async () => [...products.values()],
    getPage: async (page, size) => {
      const allProducts = [...products.values()];
      const content = allProducts.slice(page * size, (page + 1) * size);
      return {
        content,
        totalPages: Math.ceil(allProducts.length / size),
        totalElements: allProducts.length,
        hasNext: (page + 1) * size < allProducts.length,
      };
    },
    getById: async (id) => products.get(id) ?? null,
    create: async (product) => {
      products.set(product.id, product);
      return product;
    },
    update: async (product) => {
      products.set(product.id, product);
    },
    delete: async (id) => {
      products.delete(id);
    },
  };
}

describe("ProductUseCase", () => {
  test("creates, reads, updates and deletes a product", async () => {
    const repository = createRepository();
    const useCase = new ProductUseCase(repository);
    const created = await useCase.execute({
      action: "create",
      data: productInput,
    });

    expect(created.id).toMatch(/^prod-/);
    expect(
      await useCase.execute({ action: "get", id: created.id }),
    ).toMatchObject(productInput);

    const updated = await useCase.execute({
      action: "update",
      id: created.id,
      data: { ...productInput, name: "Asado actualizado" },
    });
    expect(updated.name).toBe("Asado actualizado");
    expect(await useCase.execute({ action: "list" })).toHaveLength(1);
    await expect(
      useCase.execute({ action: "delete", id: created.id }),
    ).resolves.toEqual({
      id: created.id,
      deleted: true,
    });
    expect(await useCase.execute({ action: "list" })).toHaveLength(0);
  });

  test("rejects invalid product data", async () => {
    const useCase = new ProductUseCase(createRepository());
    await expect(
      useCase.execute({
        action: "create",
        data: { ...productInput, price: -1 },
      }),
    ).rejects.toThrow("price");
  });

  test("accepts decimal product prices", async () => {
    const useCase = new ProductUseCase(createRepository());
    const created = await useCase.execute({
      action: "create",
      data: { ...productInput, price: 12500.75 },
    });

    expect(created.price).toBe(12500.75);
  });

  test("rejects negative, fractional, and non-numeric stock", async () => {
    const useCase = new ProductUseCase(createRepository());

    for (const stock of [-1, 1.5, "not-a-number"]) {
      await expect(
        useCase.execute({
          action: "create",
          data: { ...productInput, stock },
        }),
      ).rejects.toThrow("stock");
    }
  });

  test("defaults missing stock to zero", async () => {
    const useCase = new ProductUseCase(createRepository());
    const { stock } = await useCase.execute({
      action: "create",
      data: { ...productInput, stock: undefined },
    });

    expect(stock).toBe(0);
  });

  test("reports a missing product", async () => {
    const useCase = new ProductUseCase(createRepository());
    await expect(
      useCase.execute({ action: "get", id: "missing" }),
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });

  test("returns product pages with mapped content and metadata", async () => {
    const repository = createRepository();
    const useCase = new ProductUseCase(repository);
    await useCase.execute({ action: "create", data: productInput });

    await expect(
      useCase.execute({ action: "list", data: { page: 0, size: 1 } }),
    ).resolves.toMatchObject({
      content: [{ name: productInput.name }],
      totalPages: 1,
      totalElements: 1,
      hasNext: false,
    });
  });

  test.each([
    [{ page: -1, size: 10 }],
    [{ page: 0, size: 0 }],
    [{ page: 0, size: 101 }],
    [{ page: 0.5, size: 10 }],
  ])("rejects invalid pagination parameters %o", async (pagination) => {
    const useCase = new ProductUseCase(createRepository());
    await expect(
      useCase.execute({ action: "list", data: pagination }),
    ).rejects.toThrow("Pagination requires");
  });
});
