export class ProductNotFoundError extends Error {
  constructor(id) {
    super(`Product '${id}' was not found`);
    this.name = "ProductNotFoundError";
  }
}
