import { Product } from "../../../../domain/src/model/Product.js";
import { ProductEntityBuilder } from "../builders/ProductEntityBuilder.js";
import { IMapper } from "../interfaces/IMapper.js";

export class ProductDbMapper extends IMapper {
  toPersistence(product) {
    return new ProductEntityBuilder(product).build();
  }

  toDomain(entity) {
    return new Product({
      ...entity,
      image: entity.image ?? entity.imagePath ?? "",
      description: entity.description ?? entity.desc ?? "",
      cookingTip: entity.cookingTip ?? entity.coockingTip ?? "",
      isFeatured: entity.isFeatured ?? entity.isFeature ?? false,
      stock: entity.stock ?? 0,
    });
  }
}
