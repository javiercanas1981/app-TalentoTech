export const ORDER_REPOSITORY = Symbol.for("OrderRepository");

export class OrderRepository {
  async create(items) {
    throw new Error("create() must be implemented by an order repository");
  }
}
