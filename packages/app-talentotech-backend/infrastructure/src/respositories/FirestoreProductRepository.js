import { Inject } from "@nestjs/common";
import { FieldPath } from "firebase-admin/firestore";
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
    return snapshot.docs.map((document) => this.toProduct(document));
  }

  async getPage(page, size) {
    const productsCollection = this.firestore.collection(PRODUCTS_COLLECTION);
    const [snapshot, countSnapshot] = await Promise.all([
      productsCollection
        .orderBy(FieldPath.documentId())
        .offset(page * size)
        .limit(size)
        .get(),
      productsCollection.count().get(),
    ]);
    const totalElements = countSnapshot.data().count;

    return {
      content: snapshot.docs.map((document) => this.toProduct(document)),
      totalPages: Math.ceil(totalElements / size),
      totalElements,
      hasNext: (page + 1) * size < totalElements,
    };
  }

  toProduct(document) {
    return productMapper.toDomain({
      ...document.data(),
      id: document.id,
    });
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
