export class ProductEntity {
  constructor({
    id,
    name,
    category,
    price,
    stock = 0,
    unit,
    weight = "",
    rating = 0,
    reviewsCount = 0,
    image,
    description,
    cookingTip = "",
    tags = [],
    isFeatured = false,
  }) {
    Object.assign(this, {
      id,
      name,
      category,
      price,
      stock,
      unit,
      weight,
      rating,
      reviewsCount,
      image,
      description,
      cookingTip,
      tags: [...tags],
      isFeatured,
    });
  }
}
