import "dotenv/config";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ProductDto } from "../application/src/use-cases/dtos/ProductDto.js";
import { ProductMapper } from "../application/src/use-cases/mappers/ProductMapper.js";
import { FirestoreBuilder } from "../infrastructure/src/db/builders/FirestoreBuilder.js";
import { FirestoreProductRepository } from "../infrastructure/src/respositories/FirestoreProductRepository.js";

const seedFilePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../data/products.json",
);

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

export async function seedProducts({ apply = false } = {}) {
  const input = JSON.parse(await readFile(seedFilePath, "utf8"));
  const products = parseSeedProducts(input);

  if (!apply) {
    console.log(
      `Validated ${products.length} products. No Firestore changes made; pass --apply to synchronize.`,
    );
    return products.length;
  }

  const firestore = FirestoreBuilder.build();
  const repository = new FirestoreProductRepository(firestore);
  for (const product of products) {
    await repository.update(product);
  }

  for (const product of products) {
    const storedProduct = await repository.getById(product.id);
    if (
      !storedProduct ||
      storedProduct.name !== product.name ||
      storedProduct.price !== product.price ||
      storedProduct.stock.quantity !== product.stock.quantity
    ) {
      throw new Error(`Firestore verification failed for '${product.id}'`);
    }
  }

  console.log(
    `Synchronized and verified ${products.length} products in Firestore.`,
  );
  return products.length;
}

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  seedProducts({ apply: process.argv.includes("--apply") }).catch((error) => {
    console.error("Failed to synchronize product seed:", error.message);
    process.exitCode = 1;
  });
}
