import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "../../../domain/src/repositories/ProductRepository.js";
import { IUseCase } from "../interfaces/IUseCase.js";
import { ProductDto } from "./dtos/ProductDto.js";
import { ProductMapper } from "./mappers/ProductMapper.js";

export function parseSeedProducts(input) {
  if (!Array.isArray(input) || input.length === 0) {
    throw new TypeError("The products seed must be a non-empty array");
  }

  const ids = new Set();
  return input.map((entry, index) => {
    if (typeof entry?.id !== "string" || !entry.id.trim()) {
      throw new TypeError(`Product at index ${index} must have an id`);
    }
    const id = entry.id.trim();
    if (ids.has(id)) {
      throw new TypeError(`Duplicate product id '${id}' in seed data`);
    }
    ids.add(id);

    return ProductMapper.toDomain({
      ...ProductDto.from(entry),
      id,
    });
  });
}

export class SeedProductsUseCase extends IUseCase {
  constructor(productRepository) {
    super();
    this.productRepository = productRepository;
  }

  async execute({ products: input } = {}) {
    const products = parseSeedProducts(input);

    for (const product of products) {
      if (await this.productRepository.getById(product.id)) {
        await this.productRepository.update(product);
      } else {
        await this.productRepository.create(product);
      }
    }

    for (const product of products) {
      const storedProduct = await this.productRepository.getById(product.id);
      if (
        !storedProduct ||
        JSON.stringify(ProductMapper.toDto(storedProduct)) !==
          JSON.stringify(ProductMapper.toDto(product))
      ) {
        throw new Error(
          `Product repository verification failed for '${product.id}'`,
        );
      }
    }

    return products.length;
  }
}

Inject(PRODUCT_REPOSITORY)(SeedProductsUseCase, undefined, 0);
Injectable()(SeedProductsUseCase);
