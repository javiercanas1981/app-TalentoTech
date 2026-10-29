import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { OrderUseCase } from "../../application/src/use-cases/OrderUseCase.js";
import { ORDER_REPOSITORY } from "../../domain/src/repositories/OrderRepository.js";
import { ProductUseCase } from "../../application/src/use-cases/ProductUseCase.js";
import { PRODUCT_REPOSITORY } from "../../domain/src/repositories/ProductRepository.js";
import { FirestoreBuilder } from "../../infrastructure/src/db/builders/FirestoreBuilder.js";
import { FirestoreProductRepository } from "../../infrastructure/src/respositories/FirestoreProductRepository.js";
import { FirestoreOrderRepository } from "../../infrastructure/src/respositories/FirestoreOrderRepository.js";
import { OrderController } from "../../infrastructure/src/web/OrderControllerBinding.js";
import { ProductController } from "../../infrastructure/src/web/ProductControllerBinding.js";
import { ProductExceptionFilter } from "../../infrastructure/src/web/ProductExceptionFilter.js";
import { FIRESTORE } from "../../infrastructure/src/web/tokens.js";
import { AuthController } from "../../infrastructure/src/web/AuthControllerBinding.js";
import { FirebaseAuthGuard } from "../../infrastructure/src/web/FirebaseAuthGuard.js";
import { FirebaseAuthService } from "../../infrastructure/src/web/FirebaseAuthService.js";

export class AppModule {}

Module({
  controllers: [ProductController, OrderController, AuthController],
  providers: [
    OrderUseCase,
    ProductUseCase,
    { provide: APP_FILTER, useClass: ProductExceptionFilter },
    FirestoreProductRepository,
    FirestoreOrderRepository,
    FirebaseAuthService,
    FirebaseAuthGuard,
    { provide: PRODUCT_REPOSITORY, useExisting: FirestoreProductRepository },
    { provide: ORDER_REPOSITORY, useExisting: FirestoreOrderRepository },
    { provide: FIRESTORE, useFactory: () => FirestoreBuilder.build() },
  ],
})(AppModule);
