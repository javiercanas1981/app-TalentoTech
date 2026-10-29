import { describe, expect, test } from "@jest/globals";
import { AdminAuthorizationError } from "../errors/AdminAuthorizationError.js";
import { AdminAuthorizationUseCase } from "./AdminAuthorizationUseCase.js";

describe("AdminAuthorizationUseCase", () => {
  test("allows users whose profile has the admin role", async () => {
    const user = { uid: "admin-1", role: "admin" };
    const useCase = new AdminAuthorizationUseCase({
      getById: async () => user,
    });

    await expect(useCase.execute("admin-1")).resolves.toEqual(user);
  });

  test("rejects regular and missing user profiles", async () => {
    const useCase = new AdminAuthorizationUseCase({
      getById: async (uid) =>
        uid === "user-1" ? { uid, role: "user" } : null,
    });

    await expect(useCase.execute("user-1")).rejects.toBeInstanceOf(
      AdminAuthorizationError,
    );
    await expect(useCase.execute("missing-user")).rejects.toBeInstanceOf(
      AdminAuthorizationError,
    );
  });

  test("rejects an empty user id", async () => {
    const useCase = new AdminAuthorizationUseCase({
      getById: async () => null,
    });

    await expect(useCase.execute(" ")).rejects.toThrow("A user id is required");
  });
});
