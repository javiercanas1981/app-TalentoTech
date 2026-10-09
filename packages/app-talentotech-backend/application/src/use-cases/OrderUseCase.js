import { Inject, Injectable } from "@nestjs/common";
import { ORDER_REPOSITORY } from "../../../domain/src/repositories/OrderRepository.js";
import { ProductValidationError } from "../errors/ProductValidationError.js";

export class OrderUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(input = {}) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new ProductValidationError("Order data must be an object");
    }

    const { items, idempotencyKey } = input;
    if (!Array.isArray(items) || items.length === 0) {
      throw new ProductValidationError("An order must contain at least one item");
    }
    if (
      typeof idempotencyKey !== "string" ||
      !/^[A-Za-z0-9_-]{16,128}$/.test(idempotencyKey)
    ) {
      throw new ProductValidationError(
        "A valid order idempotency key is required",
      );
    }

    const quantities = new Map();
    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !item.productId.trim() ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new ProductValidationError(
          "Each order item must have a productId and a positive integer quantity",
        );
      }

      const productId = item.productId.trim();
      const quantity = (quantities.get(productId) ?? 0) + item.quantity;
      if (!Number.isSafeInteger(quantity)) {
        throw new ProductValidationError(
          `The total quantity for product '${productId}' is too large`,
        );
      }
      quantities.set(productId, quantity);
    }

    return this.orderRepository.create(
      [...quantities].map(([productId, quantity]) => ({
        productId,
        quantity,
      })),
      idempotencyKey,
    );
  }
}

Inject(ORDER_REPOSITORY)(OrderUseCase, undefined, 0);
Injectable()(OrderUseCase);
