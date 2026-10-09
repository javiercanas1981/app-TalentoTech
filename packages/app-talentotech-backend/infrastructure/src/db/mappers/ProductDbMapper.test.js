import { describe, expect, test } from "@jest/globals";
import { Product } from "../../../../domain/src/model/Product.js";
import { Stock } from "../../../../domain/src/model/Stock.js";
import { ProductDbMapper } from "./ProductDbMapper.js";

describe("ProductDbMapper", () => {
  test("maps a domain product to persistence and back", () => {
    const mapper = new ProductDbMapper();
    const product = new Product({
      id: "prod-1",
      name: "Asado de tira",
      category: "cortes",
      price: 12500,
      stock: 8,
      unit: "kg",
      weight: "1 kg aprox.",
      rating: 4.9,
      reviewsCount: 12,
      image: "https://example.com/asado.jpg",
      description: "Corte para parrilla",
      cookingTip: "Fuego medio",
      tags: ["Parrilla"],
      isFeatured: true,
    });

    const persistence = mapper.toPersistence(product);
    const restored = mapper.toDomain(persistence);

    expect(persistence).toMatchObject({
      id: "prod-1",
      name: "Asado de tira",
      stock: 8,
    });
    expect(restored).toBeInstanceOf(Product);
    expect(restored).toMatchObject(product);
    expect(restored.stock).toBeInstanceOf(Stock);
    expect(restored.stock.quantity).toBe(8);
  });

  test("normalizes legacy persistence field names", () => {
    const restored = new ProductDbMapper().toDomain({
      id: "prod-legacy",
      imagePath: "https://example.com/legacy.jpg",
      desc: "Legacy description",
      coockingTip: "Legacy tip",
      isFeature: true,
      tags: [],
    });

    expect(restored).toMatchObject({
      image: "https://example.com/legacy.jpg",
      description: "Legacy description",
      cookingTip: "Legacy tip",
      isFeatured: true,
    });
    expect(restored.stock).toBeInstanceOf(Stock);
    expect(restored.stock.quantity).toBe(0);
  });

  test("persists the stock value object as a number", () => {
    const persistence = new ProductDbMapper().toPersistence(
      new Product({ id: "prod-stock", stock: 3 }),
    );

    expect(persistence.stock).toBe(3);
  });
});
