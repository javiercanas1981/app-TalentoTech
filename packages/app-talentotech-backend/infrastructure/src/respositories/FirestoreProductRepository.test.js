import { describe, expect, jest, test } from "@jest/globals";
import { Product } from "../../../domain/src/model/Product.js";
import { FirestoreProductRepository } from "./FirestoreProductRepository.js";

describe("FirestoreProductRepository", () => {
  test("lists products from the Admin SDK collection API", async () => {
    const firestore = {
      collection: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: [
            {
              id: "product-1",
              data: () => ({ name: "Apples", price: 12, stock: 4 }),
            },
          ],
        }),
      }),
    };

    await expect(
      new FirestoreProductRepository(firestore).getAll(),
    ).resolves.toMatchObject([
      { id: "product-1", name: "Apples", price: 12, stock: { quantity: 4 } },
    ]);
    expect(firestore.collection).toHaveBeenCalledWith("products");
  });

  test("gets a product from an Admin SDK document snapshot", async () => {
    const firestore = {
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            id: "product-1",
            data: () => ({ name: "Apples", price: 12, stock: 4 }),
          }),
        }),
      }),
    };

    await expect(
      new FirestoreProductRepository(firestore).getById("product-1"),
    ).resolves.toMatchObject({ id: "product-1", name: "Apples" });
  });

  test("writes product documents using Admin SDK references", async () => {
    const document = {
      set: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    const firestore = {
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue(document),
      }),
    };
    const repository = new FirestoreProductRepository(firestore);
    const product = new Product({
      id: "product-1",
      name: "Apples",
      category: "Fruit",
      price: 12,
      unit: "kg",
      image: "",
      description: "",
      stock: 4,
    });

    await repository.create(product);
    expect(document.set).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Apples", stock: 4 }),
    );

    await repository.delete("product-1");
    expect(document.delete).toHaveBeenCalledTimes(1);
  });
});
