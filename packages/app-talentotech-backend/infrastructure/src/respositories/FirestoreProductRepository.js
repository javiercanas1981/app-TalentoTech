import { Inject } from "@nestjs/common";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
} from "firebase/firestore";
import { ProductRepository } from "../../../domain/src/repositories/ProductRepository.js";
import { ProductDbMapper } from "../db/mappers/ProductDbMapper.js";
import { FIRESTORE } from "../web/tokens.js";

const PRODUCTS_COLLECTION = "products";
const productMapper = new ProductDbMapper();

export class FirestoreProductRepository extends ProductRepository {
  constructor(firestore) {
    super();
    this.firestore = firestore;
  }

  async getAll() {
    const snapshot = await getDocs(
      collection(this.firestore, PRODUCTS_COLLECTION),
    );
    return snapshot.docs.map((document) =>
      productMapper.toDomain({
        ...document.data(),
        id: document.id,
      }),
    );
  }

  async getById(id) {
    const snapshot = await getDoc(doc(this.firestore, PRODUCTS_COLLECTION, id));
    if (!snapshot.exists()) return null;
    return productMapper.toDomain({ ...snapshot.data(), id: snapshot.id });
  }

  async create(product) {
    const entity = productMapper.toPersistence(product);
    const { id, ...data } = entity;
    await setDoc(doc(this.firestore, PRODUCTS_COLLECTION, id), data);
    return productMapper.toDomain(entity);
  }

  async update(product) {
    const entity = productMapper.toPersistence(product);
    const { id, ...data } = entity;
    await setDoc(doc(this.firestore, PRODUCTS_COLLECTION, id), data);
  }

  async delete(id) {
    await deleteDoc(doc(this.firestore, PRODUCTS_COLLECTION, id));
  }
}

Inject(FIRESTORE)(FirestoreProductRepository, undefined, 0);
