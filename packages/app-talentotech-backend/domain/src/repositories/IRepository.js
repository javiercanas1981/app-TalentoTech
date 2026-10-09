/**
 * @template T
 * @template ID
 */
export class IRepository {
  /** @param {T} entity @returns {Promise<T>} */
  async create(entity) {
    throw new Error("create() must be implemented by a repository");
  }

  /** @param {T} entity @returns {Promise<void>} */
  async update(entity) {
    throw new Error("update() must be implemented by a repository");
  }

  /** @param {ID} id @returns {Promise<T | null>} */
  async getById(id) {
    throw new Error("getById() must be implemented by a repository");
  }

  /** @param {ID} id @returns {Promise<void>} */
  async delete(id) {
    throw new Error("delete() must be implemented by a repository");
  }

  /** @returns {Promise<T[]>} */
  async getAll() {
    throw new Error("getAll() must be implemented by a repository");
  }
}
