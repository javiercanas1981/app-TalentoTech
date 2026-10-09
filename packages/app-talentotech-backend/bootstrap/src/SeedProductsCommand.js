import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  parseSeedProducts,
  SeedProductsUseCase,
} from "../../application/src/use-cases/SeedProductsUseCase.js";
import { AppModule } from "./AppModule.js";

const seedFilePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/products.json",
);

export async function seedProducts({
  apply = false,
  filePath = seedFilePath,
} = {}) {
  const input = JSON.parse(await readFile(filePath, "utf8"));

  if (!apply) {
    const products = parseSeedProducts(input);
    console.log(
      `Validated ${products.length} products. No Firestore changes made; pass --apply to synchronize.`,
    );
    return products.length;
  }

  const application = await NestFactory.createApplicationContext(AppModule);
  let count;
  try {
    count = await application
      .get(SeedProductsUseCase)
      .execute({ products: input });
  } finally {
    await application.close();
  }

  console.log(`Synchronized and verified ${count} products in Firestore.`);
  return count;
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
