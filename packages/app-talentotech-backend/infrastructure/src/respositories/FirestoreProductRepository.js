import { Inject } from "@nestjs/common";
import { ProductRepository } from "../../../domain/src/repositories/ProductRepository.js";
import { ProductDbMapper } from "../db/mappers/ProductDbMapper.js";
import { FIRESTORE } from "../di/tokens.js";

const PRODUCTS_COLLECTION = "products";
const productMapper = new ProductDbMapper();

export class FirestoreProductRepository extends ProductRepository {
  constructor(firestore) {
    super();
    this.firestore = firestore;
  }

  async getAll() {
    const snapshot = await this.firestore.collection(PRODUCTS_COLLECTION).get();
    return snapshot.docs.map((document) =>
      productMapper.toDomain({
        ...document.data(),
        id: document.id,
      }),
    );
  }

  async getById(id) {
    const snapshot = await this.firestore
      .collection(PRODUCTS_COLLECTION)
      .doc(id)
      .get();
    if (!snapshot.exists) return null;
    return productMapper.toDomain({ ...snapshot.data(), id: snapshot.id });
  }

  async create(product) {
    const entity = productMapper.toPersistence(product);
    const { id, ...data } = entity;
    await this.firestore.collection(PRODUCTS_COLLECTION).doc(id).set(data);
    return productMapper.toDomain(entity);
  }

  async update(product) {
    const entity = productMapper.toPersistence(product);
    const { id, ...data } = entity;
    await this.firestore.collection(PRODUCTS_COLLECTION).doc(id).set(data);
  }

  async delete(id) {
    await this.firestore.collection(PRODUCTS_COLLECTION).doc(id).delete();
  }
}

Inject(FIRESTORE)(FirestoreProductRepository, undefined, 0);
