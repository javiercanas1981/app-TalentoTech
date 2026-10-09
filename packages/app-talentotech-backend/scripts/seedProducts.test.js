import { describe, expect, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { Product } from "../domain/src/model/Product.js";
import { parseSeedProducts } from "./seedProducts.js";

const catalog = JSON.parse(
  await readFile(new URL("../data/products.json", import.meta.url), "utf8"),
);

describe("product Firestore seed", () => {
  test("validates the catalog and creates domain products with stock value objects", () => {
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

  test("rejects invalid stock before attempting Firestore writes", () => {
    expect(() =>
      parseSeedProducts([{ ...catalog[0], stock: -1 }]),
    ).toThrow("stock");
  });
});
