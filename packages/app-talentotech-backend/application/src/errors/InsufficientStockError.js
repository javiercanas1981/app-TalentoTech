export class InsufficientStockError extends Error {
  constructor(productId, requestedQuantity, availableStock) {
    super(
      `Insufficient stock for product '${productId}': requested ${requestedQuantity}, available ${availableStock}`,
    );
    this.name = "InsufficientStockError";
    this.productId = productId;
    this.requestedQuantity = requestedQuantity;
    this.availableStock = availableStock;
  }
}
