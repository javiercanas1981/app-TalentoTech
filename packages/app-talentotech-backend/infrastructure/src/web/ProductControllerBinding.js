import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { ProductDto } from "../../../application/src/use-cases/dtos/ProductDto.js";
import { ProductUseCase } from "../../../application/src/use-cases/ProductUseCase.js";
import { ProductController } from "./ProductController.js";
import { FirebaseAuthGuard } from "./FirebaseAuthGuard.js";
import { AdminRoleGuard } from "./AdminRoleGuard.js";

const prototype = ProductController.prototype;

function bindMethod(name, routeDecorator, parameters = [], documentation = []) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  routeDecorator(prototype, name, descriptor);
  for (const [decorator, index] of parameters) {
    decorator(prototype, name, index);
  }
  for (const decorator of documentation) {
    decorator(prototype, name, descriptor);
  }
}

Controller("products")(ProductController);
ApiTags("Products")(ProductController);
Inject(ProductUseCase)(ProductController, undefined, 0);

bindMethod(
  "findAll",
  Get(),
  [],
  [
    ApiOperation({ summary: "Retrieve all products" }),
    ApiResponse({
      status: 200,
      description: "List of products",
      type: [ProductDto],
    }),
  ],
);
bindMethod(
  "findById",
  Get(":id"),
  [[Param("id"), 0]],
  [
    ApiOperation({ summary: "Get a product by ID" }),
    ApiParam({ name: "id", type: String }),
    ApiResponse({
      status: 200,
      description: "Product details",
      type: ProductDto,
    }),
    ApiResponse({ status: 404, description: "Product not found" }),
  ],
);
bindMethod(
  "create",
  Post(),
  [[Body(), 0]],
  [
    ApiOperation({ summary: "Create a product" }),
    ApiBody({ type: ProductDto }),
    ApiResponse({
      status: 201,
      description: "Product created",
      type: ProductDto,
    }),
    ApiResponse({ status: 400, description: "Validation error" }),
  ],
);
UseGuards(FirebaseAuthGuard, AdminRoleGuard)(
  prototype,
  "create",
  Object.getOwnPropertyDescriptor(prototype, "create"),
);
Reflect.defineMetadata("design:paramtypes", [ProductDto], prototype, "create");

bindMethod(
  "update",
  Put(":id"),
  [
    [Param("id"), 0],
    [Body(), 1],
  ],
  [
    ApiOperation({ summary: "Update a product" }),
    ApiParam({ name: "id", type: String }),
    ApiBody({ type: ProductDto }),
    ApiResponse({
      status: 200,
      description: "Product updated",
      type: ProductDto,
    }),
    ApiResponse({ status: 404, description: "Product not found" }),
  ],
);
UseGuards(FirebaseAuthGuard, AdminRoleGuard)(
  prototype,
  "update",
  Object.getOwnPropertyDescriptor(prototype, "update"),
);
Reflect.defineMetadata(
  "design:paramtypes",
  [String, ProductDto],
  prototype,
  "update",
);
bindMethod(
  "delete",
  Delete(":id"),
  [[Param("id"), 0]],
  [
    ApiOperation({ summary: "Delete a product" }),
    ApiParam({ name: "id", type: String }),
    ApiResponse({ status: 200, description: "Product deleted" }),
    ApiResponse({ status: 404, description: "Product not found" }),
  ],
);
UseGuards(FirebaseAuthGuard, AdminRoleGuard)(
  prototype,
  "delete",
  Object.getOwnPropertyDescriptor(prototype, "delete"),
);

export { ProductController };
