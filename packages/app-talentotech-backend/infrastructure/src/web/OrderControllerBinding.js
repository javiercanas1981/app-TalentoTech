import {
  Body,
  Controller,
  Inject,
  Post,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderUseCase } from "../../../application/src/use-cases/OrderUseCase.js";
import { OrderController } from "./OrderController.js";

const prototype = OrderController.prototype;
const descriptor = Object.getOwnPropertyDescriptor(prototype, "create");

Controller("orders")(OrderController);
ApiTags("Orders")(OrderController);
Inject(OrderUseCase)(OrderController, undefined, 0);
Post()(prototype, "create", descriptor);
Body()(prototype, "create", 0);
ApiOperation({ summary: "Create an order and reserve inventory" })(
  prototype,
  "create",
  descriptor,
);
ApiBody({
  schema: {
    type: "object",
    required: ["items", "idempotencyKey"],
    properties: {
      items: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: { type: "string" },
            quantity: { type: "integer", minimum: 1 },
          },
        },
      },
      idempotencyKey: {
        type: "string",
        minLength: 16,
        maxLength: 128,
      },
    },
  },
})(prototype, "create", descriptor);
ApiResponse({
  status: 201,
  description: "Order confirmed and inventory updated",
})(prototype, "create", descriptor);
ApiResponse({ status: 400, description: "Invalid order" })(
  prototype,
  "create",
  descriptor,
);
ApiResponse({ status: 404, description: "Product not found" })(
  prototype,
  "create",
  descriptor,
);
ApiResponse({ status: 409, description: "Insufficient stock" })(
  prototype,
  "create",
  descriptor,
);

export { OrderController };
