import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "../../../domain/src/repositories/UserRepository.js";
import { AdminAuthorizationError } from "../errors/AdminAuthorizationError.js";

export class AdminAuthorizationUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(uid) {
    if (typeof uid !== "string" || !uid.trim()) {
      throw new TypeError("A user id is required");
    }

    const user = await this.userRepository.getById(uid.trim());
    if (!user || user.role !== "admin") {
      throw new AdminAuthorizationError();
    }

    return user;
  }
}

Inject(USER_REPOSITORY)(AdminAuthorizationUseCase, undefined, 0);
Injectable()(AdminAuthorizationUseCase);
