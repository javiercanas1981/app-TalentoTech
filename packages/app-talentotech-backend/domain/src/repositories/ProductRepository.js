import { IRepository } from "./IRepository.js";

export const PRODUCT_REPOSITORY = Symbol.for("ProductRepository");

export class ProductRepository extends IRepository {
  /** @param {import('../model/Product.js').Product} product */
  async create(product) {
    throw new Error("create() must be implemented by a product repository");
  }

  /** @param {import('../model/Product.js').Product} product */
  async update(product) {
    throw new Error("update() must be implemented by a product repository");
  }

  /** @param {string} id */
  async getById(id) {
    throw new Error("getById() must be implemented by a product repository");
  }

  /** @param {string} id */
  async delete(id) {
    throw new Error("delete() must be implemented by a product repository");
  }

  async getAll() {
    throw new Error("getAll() must be implemented by a product repository");
  }
}
