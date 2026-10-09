import { describe, expect, test } from "@jest/globals";
import { Stock } from "./Stock.js";

describe("Stock", () => {
  test("accepts only non-negative integer quantities", () => {
    expect(() => new Stock(-1)).toThrow("entero mayor o igual a cero");
    expect(() => new Stock(1.5)).toThrow("entero mayor o igual a cero");
    expect(new Stock(0).available).toBe(false);
  });

  test("returns new value objects when stock changes", () => {
    const original = new Stock(5);
    const decreased = original.decrease(2);
    const increased = decreased.increase(4);

    expect(original.quantity).toBe(5);
    expect(decreased.quantity).toBe(3);
    expect(increased.quantity).toBe(7);
    expect(original).not.toBe(decreased);
  });

  test("rejects decreasing below available stock", () => {
    expect(() => new Stock(2).decrease(3)).toThrow("Stock insuficiente");
  });
});
