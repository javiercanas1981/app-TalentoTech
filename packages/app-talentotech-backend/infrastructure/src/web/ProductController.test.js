import { describe, expect, jest, test } from "@jest/globals";
import { ProductController } from "./ProductController.js";

describe("ProductController", () => {
  test("preserves the unpaginated list response when no query is given", () => {
    const productUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    };

    new ProductController(productUseCase).findAll({});

    expect(productUseCase.execute).toHaveBeenCalledWith({ action: "list" });
  });

  test("passes zero-based page and size query parameters to the use case", () => {
    const productUseCase = {
      execute: jest.fn().mockResolvedValue({ content: [] }),
    };

    new ProductController(productUseCase).findAll({ page: "2", size: "8" });

    expect(productUseCase.execute).toHaveBeenCalledWith({
      action: "list",
      data: { page: 2, size: 8 },
    });
  });

  test.each([
    [{ page: "-1" }, "page"],
    [{ page: "1.5" }, "page"],
    [{ size: "many" }, "size"],
  ])("rejects malformed query parameters %o", async (query, name) => {
    const controller = new ProductController({ execute: jest.fn() });
    expect(() => controller.findAll(query)).toThrow(`'${name}' must`);
  });
});
