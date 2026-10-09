import { describe, expect, jest, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { Product } from "../../../domain/src/model/Product.js";
import {
  parseSeedProducts,
  SeedProductsUseCase,
} from "./SeedProductsUseCase.js";

const catalog = JSON.parse(
  await readFile(
    new URL("../../../data/products.json", import.meta.url),
    "utf8",
  ),
);

function createRepository(existingProducts = []) {
  const products = new Map(existingProducts.map((product) => [product.id, product]));
  return {
    create: jest.fn(async (product) => {
      products.set(product.id, product);
      return product;
    }),
    getById: jest.fn(async (id) => products.get(id) ?? null),
    update: jest.fn(async (product) => {
      products.set(product.id, product);
    }),
  };
}

describe("SeedProductsUseCase", () => {
  test("validates the catalog and maps stock into its value object", () => {
    const products = parseSeedProducts(catalog);

    expect(products).toHaveLength(18);
    expect(products[0]).toBeInstanceOf(Product);
    expect(products[0]).toMatchObject({ id: "prod-1", name: "Asado de Tira Premium" });
    expect(products[0].stock.quantity).toBe(10);
  });

  test("rejects duplicate product IDs", () => {
    expect(() => parseSeedProducts([catalog[0], catalog[0]])).toThrow(
      "Duplicate product id 'prod-1'",
    );
  });

  test("validates all products before making repository changes", async () => {
    const repository = createRepository();
    const useCase = new SeedProductsUseCase(repository);

    await expect(
      useCase.execute({ products: [{ ...catalog[0], stock: -1 }] }),
    ).rejects.toThrow("stock");
    expect(repository.getById).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });

  test("creates missing products and updates existing products via the repository port", async () => {
    const existingProduct = parseSeedProducts([catalog[0]])[0];
    const repository = createRepository([existingProduct]);
    const useCase = new SeedProductsUseCase(repository);

    await expect(useCase.execute({ products: catalog })).resolves.toBe(18);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledTimes(17);
    expect(repository.update).toHaveBeenCalledWith(expect.any(Product));
    expect(repository.create).toHaveBeenCalledWith(expect.any(Product));
  });

  test("rejects a repository result that does not match the seed", async () => {
    const repository = createRepository();
    repository.create.mockResolvedValue(undefined);
    const useCase = new SeedProductsUseCase(repository);

    await expect(
      useCase.execute({ products: [catalog[0]] }),
    ).rejects.toThrow("Product repository verification failed for 'prod-1'");
  });
});
