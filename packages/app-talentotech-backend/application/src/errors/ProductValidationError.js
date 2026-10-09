export class ProductValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductValidationError";
  }
}
