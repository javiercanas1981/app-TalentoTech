import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    Min,
    validateSync,
} from "class-validator";
import { ProductValidationError } from "../../errors/ProductValidationError.js";

const requiredTextFields = ["name", "category", "unit", "image", "description"];

export class ProductDto {
  static from(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new ProductValidationError("Product data must be an object");
    }

    const dto = Object.assign(new ProductDto(), input);
    const validationErrors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (validationErrors.length) {
      const messages = validationErrors.flatMap((error) =>
        Object.values(error.constraints ?? {}),
      );
      throw new ProductValidationError(messages.join(", "));
    }

    const product = {};

    for (const field of requiredTextFields) {
      if (typeof input[field] !== "string" || !input[field].trim()) {
        throw new ProductValidationError(`'${field}' is required`);
      }
      product[field] = input[field].trim();
    }

    product.price = Number(input.price);
    if (!Number.isFinite(product.price) || product.price < 0) {
      throw new ProductValidationError("'price' must be a non-negative number");
    }

    product.stock = input.stock ?? 0;

    if (input.image && !/^https?:\/\//i.test(product.image)) {
      throw new ProductValidationError("'image' must be an HTTP or HTTPS URL");
    }

    product.weight = input.weight == null ? "" : String(input.weight).trim();
    if (input.cookingTip != null && typeof input.cookingTip !== "string") {
      throw new ProductValidationError("'cookingTip' must be a string");
    }
    product.cookingTip = input.cookingTip?.trim() ?? "";
    product.rating = input.rating == null ? 0 : Number(input.rating);
    if (
      !Number.isFinite(product.rating) ||
      product.rating < 0 ||
      product.rating > 5
    ) {
      throw new ProductValidationError("'rating' must be between 0 and 5");
    }

    product.reviewsCount =
      input.reviewsCount == null ? 0 : Number(input.reviewsCount);
    if (!Number.isInteger(product.reviewsCount) || product.reviewsCount < 0) {
      throw new ProductValidationError(
        "'reviewsCount' must be a non-negative integer",
      );
    }

    if (
      input.tags != null &&
      (!Array.isArray(input.tags) ||
        input.tags.some((tag) => typeof tag !== "string"))
    ) {
      throw new ProductValidationError("'tags' must be an array of strings");
    }
    product.tags = (input.tags ?? []).map((tag) => tag.trim()).filter(Boolean);

    if (input.isFeatured != null && typeof input.isFeatured !== "boolean") {
      throw new ProductValidationError("'isFeatured' must be a boolean");
    }
    product.isFeatured = input.isFeatured ?? false;

    return product;
  }
}

const dtoPrototype = ProductDto.prototype;
const addPropertyDecorators = (property, apiOptions, decorators) => {
  ApiProperty(apiOptions)(dtoPrototype, property);
  for (const decorator of decorators) decorator(dtoPrototype, property);
};

addPropertyDecorators("id", { required: false, type: String }, [
  IsOptional(),
  IsString(),
]);
addPropertyDecorators("name", { type: String }, [IsString(), IsNotEmpty()]);
addPropertyDecorators("category", { type: String }, [IsString(), IsNotEmpty()]);
addPropertyDecorators("price", { type: Number, minimum: 0 }, [
  IsNumber(),
  Min(0),
]);
addPropertyDecorators(
  "stock",
  { required: false, type: Number, minimum: 0 },
  [IsOptional(), IsInt(), Min(0)],
);
addPropertyDecorators("unit", { type: String }, [IsString(), IsNotEmpty()]);
addPropertyDecorators("weight", { required: false, type: String }, [
  IsOptional(),
  IsString(),
]);
addPropertyDecorators(
  "rating",
  {
    required: false,
    type: Number,
    minimum: 0,
    maximum: 5,
  },
  [IsOptional(), IsNumber(), Min(0), Max(5)],
);
addPropertyDecorators(
  "reviewsCount",
  {
    required: false,
    type: Number,
    minimum: 0,
  },
  [IsOptional(), IsInt(), Min(0)],
);
addPropertyDecorators("image", { type: String, format: "uri" }, [
  IsString(),
  IsNotEmpty(),
  IsUrl({ protocols: ["http", "https"], require_protocol: true }),
]);
addPropertyDecorators("description", { type: String }, [
  IsString(),
  IsNotEmpty(),
]);
addPropertyDecorators("cookingTip", { required: false, type: String }, [
  IsOptional(),
  IsString(),
]);
addPropertyDecorators(
  "tags",
  {
    required: false,
    type: [String],
  },
  [IsOptional(), IsArray(), IsString({ each: true })],
);
addPropertyDecorators("isFeatured", { required: false, type: Boolean }, [
  IsOptional(),
  IsBoolean(),
]);
