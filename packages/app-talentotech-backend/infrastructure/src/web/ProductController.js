export class ProductController {
  constructor(productUseCase) {
    this.productUseCase = productUseCase;
  }

  findAll() {
    return this.productUseCase.execute({ action: "list" });
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
