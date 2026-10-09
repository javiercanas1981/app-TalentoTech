import { Product } from "../../../../domain/src/model/Product.js";

export class ProductMapper {
  static toDomain(productDto) {
    return new Product(productDto);
  }

  static toDto(product) {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock.quantity,
      unit: product.unit,
      weight: product.weight,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      image: product.image,
      description: product.description,
      cookingTip: product.cookingTip,
      tags: [...product.tags],
      isFeatured: product.isFeatured,
    };
  }
}
