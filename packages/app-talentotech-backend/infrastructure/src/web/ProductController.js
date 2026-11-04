export class ProductController {
  constructor(productUseCase) {
    this.productUseCase = productUseCase;
  }

  findAll(query) {
    if (query.page === undefined && query.size === undefined) {
      return this.productUseCase.execute({ action: "list" });
    }

    const page = this.parseQueryInteger(query.page ?? "0", "page");
    const size = this.parseQueryInteger(query.size ?? "12", "size");
    return this.productUseCase.execute({
      action: "list",
      data: { page, size },
    });
  }

  parseQueryInteger(value, name) {
    if (!/^\d+$/.test(value)) {
      throw new TypeError(`'${name}' must be a non-negative integer`);
    }
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed)) {
      throw new TypeError(`'${name}' is outside the supported range`);
    }
    return parsed;
  }

  findById(id) {
    return this.productUseCase.execute({ action: "get", id });
  }

  create(data) {
    return this.productUseCase.execute({ action: "create", data });
  }

  update(id, data) {
    return this.productUseCase.execute({ action: "update", id, data });
  }

  delete(id) {
    return this.productUseCase.execute({ action: "delete", id });
  }
}
