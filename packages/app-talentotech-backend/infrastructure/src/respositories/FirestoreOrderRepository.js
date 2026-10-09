import { Inject } from "@nestjs/common";
import { collection, doc, runTransaction } from "firebase/firestore";
import { InsufficientStockError } from "../../../application/src/errors/InsufficientStockError.js";
import { ProductNotFoundError } from "../../../application/src/errors/ProductNotFoundError.js";
import { Stock } from "../../../domain/src/model/Stock.js";
import { OrderRepository } from "../../../domain/src/repositories/OrderRepository.js";
import { FIRESTORE } from "../web/tokens.js";

const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";

export class FirestoreOrderRepository extends OrderRepository {
  constructor(firestore) {
    super();
    this.firestore = firestore;
  }

  async create(items, idempotencyKey) {
    const productReferences = items.map(({ productId }) =>
      doc(this.firestore, PRODUCTS_COLLECTION, productId),
    );
    const orderReference = doc(
      collection(this.firestore, ORDERS_COLLECTION),
      idempotencyKey,
    );
    const createdAt = new Date();

    return runTransaction(this.firestore, async (transaction) => {
      const existingOrderSnapshot = await transaction.get(orderReference);
      if (existingOrderSnapshot.exists()) {
        const existingOrder = existingOrderSnapshot.data();
        const savedAt =
          typeof existingOrder.createdAt?.toDate === "function"
            ? existingOrder.createdAt.toDate()
            : new Date(existingOrder.createdAt);
        return {
          ...existingOrder,
          id: orderReference.id,
          createdAt: savedAt.toISOString(),
        };
      }

      const productSnapshots = [];
      for (const productReference of productReferences) {
        productSnapshots.push(await transaction.get(productReference));
      }

      const orderItems = productSnapshots.map((snapshot, index) => {
        const requestedItem = items[index];
        if (!snapshot.exists()) {
          throw new ProductNotFoundError(requestedItem.productId);
        }

        const product = snapshot.data();
        const availableStock = new Stock(product.stock ?? 0);
        if (!availableStock.hasAvailable(requestedItem.quantity)) {
          throw new InsufficientStockError(
            requestedItem.productId,
            requestedItem.quantity,
            availableStock.quantity,
          );
        }
        if (!Number.isFinite(product.price) || product.price < 0) {
          throw new Error(
            `Product '${requestedItem.productId}' has an invalid price`,
          );
        }

        const remainingStock = availableStock.decrease(
          requestedItem.quantity,
        );
        return {
          productId: requestedItem.productId,
          name: product.name,
          unitPrice: product.price,
          quantity: requestedItem.quantity,
          subtotal: product.price * requestedItem.quantity,
          remainingStock: remainingStock.quantity,
        };
      });

      const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      const persistedItems = orderItems.map(
        ({ remainingStock, ...item }) => item,
      );

      orderItems.forEach((item, index) => {
        transaction.update(productReferences[index], {
          stock: item.remainingStock,
        });
      });
      transaction.set(orderReference, {
        id: orderReference.id,
        items: persistedItems,
        total,
        status: "confirmed",
        createdAt,
      });

      return {
        id: orderReference.id,
        items: persistedItems,
        total,
        status: "confirmed",
        createdAt: createdAt.toISOString(),
      };
    });
  }
}

Inject(FIRESTORE)(FirestoreOrderRepository, undefined, 0);
