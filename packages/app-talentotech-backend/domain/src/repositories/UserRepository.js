export const USER_REPOSITORY = Symbol.for("UserRepository");

export class UserRepository {
  async create(uid, profile) {
    throw new Error("create() must be implemented by a user repository");
  }

  async getById(uid) {
    throw new Error("getById() must be implemented by a user repository");
  }
}
