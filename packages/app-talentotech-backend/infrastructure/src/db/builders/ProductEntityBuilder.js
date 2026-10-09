import { ProductEntity } from "../entities/ProductEntity.js";

export class ProductEntityBuilder {
  constructor(product) {
    this.product = product;
  }

  build() {
    if (!this.product?.id) {
      throw new TypeError(
        "A product id is required to build a database entity",
      );
    }
    return new ProductEntity({
      ...this.product,
      stock: this.product.stock.quantity,
      tags: [...(this.product.tags ?? [])],
    });
  }
}
