import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PRODUCT_REPOSITORY } from "../../../domain/src/repositories/ProductRepository.js";
import { ProductNotFoundError } from "../errors/ProductNotFoundError.js";
import { IUseCase } from "../interfaces/IUseCase.js";
import { ProductDto } from "./dtos/ProductDto.js";
import { ProductMapper } from "./mappers/ProductMapper.js";

export class ProductUseCase extends IUseCase {
  constructor(productRepository) {
    super();
    this.productRepository = productRepository;
  }

  async execute({ action, id, data } = {}) {
    switch (action) {
      case "list":
        return (await this.productRepository.getAll()).map(ProductMapper.toDto);
      case "get": {
        const product = await this.productRepository.getById(
          this.requireId(id),
        );
        if (!product) throw new ProductNotFoundError(id);
        return ProductMapper.toDto(product);
      }
      case "create": {
        const product = ProductMapper.toDomain({
          ...ProductDto.from(data),
          id: `prod-${randomUUID()}`,
        });
        return ProductMapper.toDto(
          await this.productRepository.create(product),
        );
      }
      case "update": {
        const productId = this.requireId(id);
        if (!(await this.productRepository.getById(productId))) {
          throw new ProductNotFoundError(productId);
        }
        const product = ProductMapper.toDomain({
          ...ProductDto.from(data),
          id: productId,
        });
        await this.productRepository.update(product);
        return ProductMapper.toDto(product);
      }
      case "delete": {
        const productId = this.requireId(id);
        if (!(await this.productRepository.getById(productId))) {
          throw new ProductNotFoundError(productId);
        }
        await this.productRepository.delete(productId);
        return { id: productId, deleted: true };
      }
      default:
        throw new TypeError(`Unsupported product action '${action}'`);
    }
  }

  requireId(id) {
    if (typeof id !== "string" || !id.trim()) {
      throw new TypeError("A product id is required");
    }
    return id.trim();
  }
}

Inject(PRODUCT_REPOSITORY)(ProductUseCase, undefined, 0);
Injectable()(ProductUseCase);
