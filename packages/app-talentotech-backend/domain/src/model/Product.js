import { Stock } from "./Stock.js";

export class Product {
  constructor({
    id,
    name,
    category,
    price,
    unit,
    weight = "",
    rating = 0,
    reviewsCount = 0,
    image,
    description,
    cookingTip = "",
    tags = [],
    isFeatured = false,
    stock = 0,
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.unit = unit;
    this.weight = weight;
    this.rating = rating;
    this.reviewsCount = reviewsCount;
    this.image = image;
    this.description = description;
    this.cookingTip = cookingTip;
    this.tags = [...tags];
    this.isFeatured = isFeatured;

    // Value Object
    this.stock = stock instanceof Stock ? stock : new Stock(stock);
  }
}
